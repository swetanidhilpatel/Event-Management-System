import mongoose from "mongoose";

// Define the schema for a Ticket
const ticketSchema = new mongoose.Schema(
  {
    userid: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String, // Added contact number field
      required: true, // Make it mandatory
    },
    numberOfTickets: {
      type: Number,
      required: true,
      min: 1, // Ensure at least one ticket is purchased
    },
    names: {
      type: [String],
      required: true,
      validate: [arrayLimit, "At least one name is required"],
    },
    ages: {
      type: [Number], 
      required: true 
    },
    ticketIds: {
      type: [String],
      required: true,
      validate: [arrayLimit, "Ticket IDs are required"],
    },
    qrCodeImage: {
      type: [String], // Changed to array of strings
      required: false,
    },
    pid: {
      type: String, // Added pid (for storing payment ID or any unique ID)
      required: false, // Adjust based on whether this should be mandatory
    },
    payid: {
      type: String, // Added payid (for storing transaction or payment reference)
      required: false, // Adjust based on whether this should be mandatory
    },
    emailSent: {
      type: Boolean, // New field for tracking email status
      default: false, // Default to false initially
    },
    totalPrice: {
      type: Number,
      required: false, // Optional if you need to store the total price
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Helper function to validate array length
function arrayLimit(val) {
  return val.length > 0;
}

// Create and export the Ticket model
const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;