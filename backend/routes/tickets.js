import express from "express";
import Ticket from "../models/Tickets.js"; // Import your Mongoose Ticket model
import TicketScanner from '../models/TicketScanner.js'; // Import the schema

const router = express.Router();

// Seven Digit
const generateSevenDigitNumber = () => {
  return Math.floor(1000000 + Math.random() * 9000000);
};

const generateUniqueSevenDigitNumber = async () => {
  let isUnique = false;
  let userid;

  while (!isUnique) {
    userid = generateSevenDigitNumber();
    const existingTicket = await Ticket.findOne({ userid });
    if (!existingTicket) {
      isUnique = true;
    }
  }

  return userid;
};

// Six Digit
const generateSixDigitNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const generateUniqueSixDigitNumber = async () => {
  let isUnique = false;
  let ticketId;

  while (!isUnique) {
    ticketId = generateSixDigitNumber();
    const existingTicket = await Ticket.findOne({ ticketIds: ticketId });
    if (!existingTicket) {
      isUnique = true;
    }
  }

  return ticketId;
};

// Function to calculate ticket price based on age
const calculateTicketPrice = (age) => {
  if (age > 13) return 15; // €15 for people older than 13 years
  if (age >= 8 && age <= 13) return 5; // €5 for ages 8-13
  return 0; // Free for those under 8 years old
};

// Create a new ticket
router.post("/", async (req, res) => {
  try {
    const { email, tickets, names, ages, contactNumber } = req.body;

    if (!email || !tickets || !names || !ages || !contactNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Calculate total price based on ages
    let totalPrice = 0;
    ages.forEach(age => {
      totalPrice += calculateTicketPrice(age);
    });

    const ticketIds = await Promise.all(names.map(() => generateUniqueSixDigitNumber()));
    const userid = await generateUniqueSevenDigitNumber();

    const newTicket = new Ticket({
      email,
      userid,
      contactNumber,
      numberOfTickets: parseInt(tickets),
      names,
      ages,  // Added ages field
      ticketIds,
      totalPrice, // Store total price
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch ticket details
router.get("/:ticketId", async (req, res) => {
  try {
    const userId = req.params.ticketId;
    const ticket = await Ticket.findOne({ userid: userId });

    if (ticket) {
      if (ticket.pid && ticket.payid) {
        res.status(200).json({
          _id: ticket._id,
          userid: ticket.userid,
          email: ticket.email,
          names: ticket.names,
          ticketIds: ticket.ticketIds,
          totalPrice: ticket.totalPrice, // Include total price in the response
        });
      } else {
        console.log("Either pid or payid is missing in the document");
      }
    } else {
      console.log("No ticket found with the given userId");
    }
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





// Create New Ticket By Admin

router.post("/addtickets", async (req, res) => {
  try {
    const { email, tickets, names, ages, contactNumber, selectedName, message } = req.body;

    // Validate the required fields
    if (!email || !tickets || !names || !ages || !contactNumber || !selectedName || !message) {
      return res.status(400).json({ error: "All fields are required, including selectedName" });
    }

    // Calculate total price based on ages
    let totalPrice = 0;
    ages.forEach(age => {
      totalPrice += calculateTicketPrice(age);
    });

    const ticketIds = await Promise.all(names.map(() => generateUniqueSixDigitNumber()));
    const userid = await generateUniqueSevenDigitNumber();

    // Assign the selectedName to both payid and pid
    const payid = selectedName;
    const pid = message;

    // Create the new ticket with all fields
    const newTicket = new Ticket({
      email,
      userid,
      contactNumber,
      numberOfTickets: parseInt(tickets),
      names,
      ages,  // Storing ages
      ticketIds,
      totalPrice, // Store total price
      payid,      // Assigning payid
      pid,        // Assigning pid
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});



// Route to fetch user ticket details by ticketId
router.get('/userticket/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Check if the ticket has already been scanned
    const existingScan = await TicketScanner.findOne({ ticketId: ticketId });
    if (existingScan) {
      return res.status(400).json({
        message: 'Ticket has already been scanned',
        name: existingScan.name,
        scannedAt: existingScan.scanTime, // Return the previous scan time
      });
    }

    // Find the ticket that contains the ticketId in the ticketIds array
    const ticket = await Ticket.findOne({ ticketIds: ticketId });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const index = ticket.ticketIds.indexOf(ticketId);
    if (index === -1) {
      return res.status(404).json({ message: 'Ticket ID not found in the ticket' });
    }

    // Extract user details from the ticket
    const userDetails = {
      ticketId,
      name: ticket.names[index],
      age: ticket.ages[index],
      email: ticket.email,
      contactNumber: ticket.contactNumber,
      numberOfTickets: ticket.numberOfTickets,
      qrCodeImage: ticket.qrCodeImage ? ticket.qrCodeImage[index] : null,
      totalPrice: ticket.totalPrice,
    };

    // Save the scan details to the new TicketScanner collection
    const ticketScan = new TicketScanner({
      ticketId: userDetails.ticketId,
      name: userDetails.name,
      age: userDetails.age,
      email: userDetails.email,
      contactNumber: userDetails.contactNumber,
    });

    await ticketScan.save(); // Save the scan details to the database

    res.json(userDetails); // Return the ticket details to the client
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;