import express from 'express';
import cloudinary from 'cloudinary';
import Ticket from '../models/Tickets.js'; // Adjust the path according to your project structure

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});

const router = express.Router();

router.post('/upload-qrcodes', async (req, res) => {
  const { userid, ticketIds, imagesData } = req.body; // Accept multiple ticket IDs and images

  try {
    // Fetch the existing ticket
    const ticket = await Ticket.findOne({ userid });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Initialize an array to store the new QR code URLs
    const uploadedImages = [];

    // Loop over ticket IDs and image data for upload
    for (let i = 0; i < ticketIds.length; i++) {
      const ticketId = ticketIds[i];
      const imageData = imagesData[i];

      // Check if QR code URL already exists for this ticket ID
      if (ticket.qrCodeImage && ticket.qrCodeImage.some(url => url.includes(ticketId))) {
        console.log(`QR code for ticket ${ticketId} already exists, skipping upload.`);
        uploadedImages.push(ticket.qrCodeImage.find(url => url.includes(ticketId)));
        continue;
      }

      // Upload the image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(imageData, {
        folder: 'qrcodes',
        public_id: `${userid}_${ticketId}`, // Unique identifier for the image
      });

      // Push the new Cloudinary URL to the array
      uploadedImages.push(result.secure_url);
    }

    // Update the ticket with the new QR code URLs
    ticket.qrCodeImage = [...ticket.qrCodeImage, ...uploadedImages];
    await ticket.save();

    res.json({ success: true, urls: uploadedImages });
  } catch (error) {
    console.error("Error uploading QR codes:", error);
    res.status(500).json({ success: false, message: 'Failed to upload QR codes' });
  }
});

export default router;