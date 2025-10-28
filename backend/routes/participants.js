import express from 'express';
import Ticket from '../models/Tickets.js'; // Adjust path if necessary

const router = express.Router();

// GET all participants
router.get('/participants', async (req, res) => {
  try {
    // Fetch all participant data from Ticket collection
    const participants = await Ticket.find();
    
    // Structure the participants data in the required format
    const formattedParticipants = participants.map((participant) => {
      return {
        userId: participant.userid,
        email: participant.email,
        contactNumber: participant.contactNumber,
        noOfTickets: participant.numberOfTickets,
        names: participant.names, // Contains all names
        ticketIds: participant.ticketIds, // Contains all ticket IDs
        payerId: participant.payid,
        pid: participant.pid
      };
    });

    // Return the formatted participants data
    res.status(200).json(formattedParticipants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ message: 'Server error. Unable to fetch participants.' });
  }
});

export default router;