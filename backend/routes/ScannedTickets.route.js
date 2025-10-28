import express from 'express';
import TicketScanner from '../models/TicketScanner.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to fetch participants with pid and payid
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        // Make sure you are querying the correct model
        const scannedTickets = await TicketScanner.find({});
        res.json(scannedTickets);
      } catch (error) {
        console.error("Error fetching scanned tickets:", error);
        res.status(500).json({ message: "Server Error" });
      }
});

export default router;