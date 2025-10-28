import dotenv from "dotenv";
import paypal from "paypal-rest-sdk";
import Ticket from "../models/Tickets.js";

dotenv.config();

var totalPrice;

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

const paymentMethod = async (req, res) => {
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
    const totalAmount = totalPrice.toFixed(2);

    const createPaymentJson = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `https://event-creator-backend.vercel.app/api/success/${userId}`,
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
};

const paymentSuccess = async (req, res) => {
  try {
    // Email Start

    // Email End

    const userId = req.params.userid;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    // Update the payment details in the database using userId
    const ticket = await Ticket.findOne({ userid: userId });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Update pid and payid in the ticket
    ticket.pid = payerId;
    ticket.payid = paymentId;

    // Save the updated ticket
    await ticket.save();

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: process.env.PAYPAL_CURRENCY,
            total: totalPrice, // Use totalPrice if it's defined elsewhere
          },
        },
      ],
    };

    // Execute the payment (assuming you have the PayPal API setup correctly)
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error);
          return res.redirect("https://www.matangievent.com/");
        } else {
          console.log("Execute Payment Response");
          return res.redirect("https://www.matangievent.com/paymentconfirm");
        }
      }
    );
  } catch (error) {
    console.error("Error in payment success:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const paymentFailed = async (req, res) => {
  localStorage.removeItem("userId");
  localStorage.removeItem("pid");
  localStorage.removeItem("payid");
  return res.redirect("https://www.matangievent.com/");
};



export { paymentMethod, paymentSuccess, paymentFailed };
