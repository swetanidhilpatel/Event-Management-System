import Ticket from '../models/Tickets.js';

// Controller function to delete a participant by userid
const deleteParticipantById = async (req, res) => {
  try {
    const { userid } = req.params;

    // Find the ticket by userid
    const ticket = await Ticket.findOne({ userid });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Participant not found"
      });
    }

    // Remove the participant
    await Ticket.deleteOne({ userid });

    res.status(200).json({
      success: true,
      message: "Participant deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting participant:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export default deleteParticipantById;