import express from 'express';
import deleteParticipantById from '../controller/participantsdelete.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

// Route to delete a participant by userid (only accessible by admin)
router.delete('/delete/:userid', auth, isAdmin, deleteParticipantById);

export default router;
