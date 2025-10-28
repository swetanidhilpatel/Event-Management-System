import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Ticket from "../models/Tickets.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_ID,
    pass: process.env.APP_PASSWORD,
  },
});

const sendMail = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch ticket details for the user
    const ticket = await Ticket.findOne({ userid: userId });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if the email has already been sent
    if (ticket.emailSent) {
      return res.status(400).json({ message: "Email has already been sent" });
    }

    // Create a map of ticketId -> qrCodeImage from the stored URLs
    const qrCodeMap = {};
    ticket.qrCodeImage.forEach((url) => {
      const match = url.match(/qrcodes\/\d+_(\d+)\.png/); // Extract ticketId from URL
      if (match && match[1]) {
        const ticketId = match[1]; // Extracted ticketId
        qrCodeMap[ticketId] = url; // Map ticketId to corresponding QR code URL
      }
    });

    // Construct the HTML email with embedded QR codes and ticket details
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="text-align: center;">Ticket Confirmation</h2>
    <p style="text-align: center;">If you do not receive the QR code via email, you can still gain entry using your ticket ID. Thank you.</p>
    <div style="max-width: 600px; margin: 0 auto;">
      ${ticket.names
        .map((name, index) => {
          const ticketId = ticket.ticketIds[index];
          const qrCodeUrl = qrCodeMap[ticketId]; // Get the QR code URL based on ticketId

          return `
            <div style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px;">
              <img src="cid:poster" alt="Event Poster" style="width: 100%; height: auto; border-radius: 8px;">
              <h3>Ticket for: ${name}</h3>
              <p><strong>Ticket ID:</strong> ${ticketId}</p>
              <img src="${qrCodeUrl}" alt="QR Code" style="width: 128px; height: 128px;">
              
              <!-- Timing and Date -->
              <p style="font-size: 16px; margin-top: 10px;">
                📅 <strong>October 05, 03:00 PM</strong>
              </p>

              <!-- Address -->
              <p>
                <strong>Address:</strong><br>
                Kulturzentrum Färberei,<br>
                Universitätplatz 10,<br>
                34127 Kassel
              </p>
            </div>
          `;
        })
        .join("")}
    </div>
  </div>
`;

    const mailOptions = {
      from: {
        name: "IndianEventKassel",
        address: "indianeventkassel@gmail.com",
      },
      to: ticket.email,
      subject: "Your Ticket Confirmation",
      html: htmlContent,
      attachments: [
        {
          filename: "poster.png",
          path: "https://res.cloudinary.com/djafo8itv/image/upload/v1725643027/ajjizv6jtf9qztpxx5rt.png",
          cid: "poster",
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    // Update emailSent to true after successfully sending the email
    ticket.emailSent = true;
    await ticket.save();

    res.json({ success: true, message: "Confirmation email sent!" });
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

export default sendMail;
