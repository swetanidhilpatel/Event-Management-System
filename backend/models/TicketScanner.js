import mongoose from 'mongoose';

const ticketScannerSchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  scanTime: { type: Date, default: Date.now } // Automatically store the time of the scan
});

const TicketScanner = mongoose.model('ticketscanner', ticketScannerSchema);

export default TicketScanner;