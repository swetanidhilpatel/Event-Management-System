import express from "express";
import dotenv from "dotenv";
import { mongoDB } from "./db/db.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import user from "./routes/user.route.js";
import admin from "./routes/admin.route.js";
import cors from "cors";
import { auth } from "./middleware/auth.middleware.js";
import ticketsRoutes from "./routes/tickets.js";
import sendMail from "./controller/sendMail.controller.js";
import ParticipantsList from "./routes/ParticipantList.route.js";
import ParticipantsDelete from "./routes/participantdelete.route.js";
import TicketScannedList from "./routes/ScannedTickets.route.js";
import QrCodeUpload from "./routes/qrcodeupload.route.js";
import participantRoutes from "../backend/routes/participants.js";
import paypal from "paypal-rest-sdk";
import Ticket from "./models/Tickets.js";

dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoDB();

// CORS options to allow specific origins
app.use(
  cors({
    origin: ["https://event.matangievent.com"], // Add your frontend origin here
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Date",
      "X-Api-Version",
    ], // Adjust allowed headers if needed
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api/v1/user", user);
app.use("/api/v1/admin", auth, admin);

app.use("/api/tickets", ticketsRoutes);

app.use("/api/participants", ParticipantsList);
app.use("/api/participants", ParticipantsDelete );
app.use("/api/scannedticketlist", TicketScannedList);

// Email Start
app.post("/api/mail/:userId", sendMail);
// Email End

// QR Code Start

app.use("/api", QrCodeUpload);

// QR Code End










// Payment Method Start


var totalAmount;

// Payment Api

// PayPal configuration
paypal.configure({
  mode: "live", //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const calculateTicketPrice = (age) => {
  if (age > 13) return 15;
  if (age >= 8 && age <= 13) return 5;
  return 0;
};

app.post("/api/payment/:userid", async (req, res) => {
  try {
    const userId = req.params.userid;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the ticket details from the database
    const ticket = await Ticket.findOne({ userid: userId });
    if (!ticket || !ticket.names.length) {
      return res
        .status(404)
        .json({ message: "No tickets found for this user" });
    }

    const ages = ticket.ages;
    let totalPrice = 0;

    // Calculate the total price based on ages
    for (const age of ages) {
      totalPrice += calculateTicketPrice(age);
    }

    // Round to two decimal places
    totalAmount = totalPrice.toFixed(2);

    const createPaymentJson = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `https://event-creator-backend.vercel.app/success/${userId}`,
        cancel_url: "https://www.matangievent.com/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Ticket",
                sku: "ticket",
                price: totalAmount,
                currency: process.env.PAYPAL_CURRENCY,
                quantity: 1, // Set quantity to 1 since we are summing the price
              },
            ],
          },
          amount: {
            currency: process.env.PAYPAL_CURRENCY,
            total: totalAmount,
          },
          description: "Payment for tickets based on age.",
        },
      ],
    };

    const payment = await new Promise((resolve, reject) => {
      paypal.payment.create(createPaymentJson, (error, payment) => {
        if (error) {
          return reject(error);
        }
        resolve(payment);
      });
    });

    console.log("Create Payment Response", payment);
    res.json(payment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the payment" });
  }
});

app.get("/success/:userid", async (req, res) => {
  try {
    const userId = req.params.userid;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    if (!payerId || !paymentId) {
      return res.status(400).json({ message: "PayerID and PaymentID are required" });
    }

    // Prepare the payment execution object
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: process.env.PAYPAL_CURRENCY,
            total: totalAmount, // Make sure totalAmount is defined or calculated
          },
        },
      ],
    };

    // Execute the payment via PayPal API
    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
      if (error) {
        console.error("PayPal Payment Execution Error:", error);
        return res.redirect("https://www.matangievent.com/");
      } else {
        // console.log("Execute Payment Response:", payment);

        // After successful payment execution, update the payment details in the database
        const ticket = await Ticket.findOne({ userid: userId });

        if (!ticket) {
          return res.status(404).json({ message: "Ticket not found" });
        }

        // Update the pid and payid fields in the ticket
        ticket.pid = payerId;
        ticket.payid = paymentId;

        // Save the updated ticket
        await ticket.save();

        // Redirect to the confirmation page after saving the ticket
        return res.redirect("https://www.matangievent.com/paymentconfirm");
      }
    });
  } catch (error) {
    console.error("Error in payment success:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/failed", async (req, res) => {
  localStorage.removeItem("userId");
  localStorage.removeItem("pid");
  localStorage.removeItem("payid");
  return res.redirect("https://www.matangievent.com/");
});



// Payment Method End






app.use(notFound);
app.use(errorHandler);

// Admin

app.use("/api", participantRoutes); // Use the participants routes



// app.use("/api", ticketsRoutes);

app.listen(port, () => {
  console.log("listening on port " + port);
});
