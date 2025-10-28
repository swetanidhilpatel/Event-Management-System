import express from 'express';
import Ticket from '../models/Tickets.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to fetch participants with pid and payid
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    // Fetch participants where pid and payid are present
    const participants = await Ticket.find({
      pid: { $exists: true, $ne: null },   // Ensure pid exists and is not null
      payid: { $exists: true, $ne: null }  // Ensure payid exists and is not null
    });

    if (participants.length === 0) {
      return res.status(404).json({ message: 'No participants found with both pid and payid' });
    }

    res.status(200).json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;