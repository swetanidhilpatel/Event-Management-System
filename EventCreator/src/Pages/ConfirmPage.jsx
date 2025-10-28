import React, { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AdminAddConfirmPage = () => {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(false);

  axios.defaults.withCredentials = true;

  // Fetch ticket details (GET request)
  useEffect(() => {
    const fetchTicketDetails = async () => {
      const userid = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `https://event-creator-backend.vercel.app/api/tickets/${userid}`
        );
        setTicketDetails(response.data);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
      }
    };

    fetchTicketDetails();
  }, []);

  // Upload QR codes and send email
  useEffect(() => {
    const uploadQRCodeAndSendEmail = async () => {
      if (!ticketDetails) return;

      const userid = localStorage.getItem("userId");

      // Check if QR codes are already uploaded
      const qrCodeImage = ticketDetails.qrCodeImage || [];
      const shouldUploadQRCode = qrCodeImage.length === 0;

      if (shouldUploadQRCode) {
        try {
          // Generate QR code images and upload them all at once
          const imagesData = await Promise.all(
            ticketDetails.ticketIds.map(async (ticketId, index) => {
              const canvas = await waitForCanvasToRender(`qrcode-${index}`);
              return canvas.toDataURL("image/png");
            })
          );

          const response = await axios.post(
            "https://event-creator-backend.vercel.app/api/upload-qrcodes",
            {
              userid,
              ticketIds: ticketDetails.ticketIds, // Send all ticket IDs
              imagesData, // Send all images
            }
          );

          if (response.data.success) {
            console.log("All QR codes uploaded successfully");
            setUploadStatus(true); // Update the status
          }
        } catch (error) {
          console.error("Error uploading QR codes:", error);
        }
      }
    };

    const waitForCanvasToRender = async (canvasId) => {
      return new Promise((resolve) => {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
          resolve(canvas);
        } else {
          const checkInterval = setInterval(() => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
              clearInterval(checkInterval);
              resolve(canvas);
            }
          }, 100); // Check every 100ms
        }
      });
    };

    const sendEmail = async () => {
      const userid = localStorage.getItem("userId");
      if (uploadStatus && !ticketDetails.emailSent) {
        setTimeout(async () => {
          await axios.post(
            `https://event-creator-backend.vercel.app/api/mail/${userid}`
          );
          console.log("Confirmation email sent!");
        }, 10000); // 10-second delay before sending email
      }
    };

    uploadQRCodeAndSendEmail().then(sendEmail);
  }, [ticketDetails, uploadStatus]);

  // Function to download each ticket on its own page in the PDF
  const downloadTickets = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, A4 size
    const ticketsPerPage = 4; // We want 4 tickets per page
    let ticketsAdded = 0;

    // Force large screen size when rendering PDF (e.g., for laptop layout)
    const originalWidth = window.innerWidth;
    document.body.style.width = '1200px';

    // Loop through each ticket, render it to canvas, and add to the PDF
    for (let index = 0; index < ticketDetails.names.length; index++) {
      const ticketDiv = document.getElementById(`ticket-${index}`);

      // Convert each ticket to a canvas image
      const canvas = await html2canvas(ticketDiv, {
        scale: 2, // For better resolution
        useCORS: true, // Handle CORS for images
        windowWidth: 1200, // Emulate large screen size in PDF
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add "matangievent.com" text at the top of the page only once per page
      if (ticketsAdded % ticketsPerPage === 0) {
        pdf.setFontSize(16);
        pdf.text("www.matangievent.com", 105, 20, { align: "center" });
      }

      // Add ticket image below the "matangievent.com" text
      const yPosition = 40 + (ticketsAdded % ticketsPerPage) * imgHeight; // Position each ticket based on the number added to the page
      pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight);

      // After adding 4 tickets, create a new page
      ticketsAdded++;
      if (ticketsAdded % ticketsPerPage === 0 && index < ticketDetails.names.length - 1) {
        pdf.addPage();
      }
    }

    // Reset the page width to its original state
    document.body.style.width = `${originalWidth}px`;

    // Save the generated PDF
    pdf.save("tickets.pdf");
  };

  return (
    <div id="page-section" className="pt-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Ticket Confirmation
        </h2>

        {/* Download button */}
        <div className="text-center mb-8">
          <button
            onClick={downloadTickets}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download Tickets
          </button>
        </div>

        <div className="flex flex-col gap-8">
          {ticketDetails &&
            ticketDetails.names.map((name, index) => (
              <div
                key={index}
                id={`ticket-${index}`} // Each ticket will be captured separately
                className="flex flex-col lg:flex-row items-center border p-6 shadow-lg rounded-lg"
              >
                {/* Left side: Poster and Address/DateTime */}
                <div className="w-full lg:w-2/3 mb-4 lg:mb-0">
                  <h3 className="text-xl font-semibold text-center mb-4">
                    Gujarati Samaj Kassel
                  </h3>
                  <img
                    src="https://res.cloudinary.com/djafo8itv/image/upload/v1725643027/ajjizv6jtf9qztpxx5rt.png"
                    alt="Event Placeholder"
                    className="w-full h-auto rounded-lg mb-4"
                  />

                  {/* Date, Time, and Address below the poster */}
                  <div className="flex flex-col text-center mt-4 text-gray-700 text-sm lg:flex-row lg:justify-center lg:items-center">
                    <p className="mb-2 lg:mb-0 lg:mr-4">
                      <span role="img" aria-label="calendar">
                        📅
                      </span>{" "}
                      October 05, 03:00 PM
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Address:</strong> Kulturzentrum Färberei,
                      Universitätplatz 10, 34127 Kassel
                    </p>
                  </div>
                </div>

                {/* Right side: QR code and Ticket details */}
                <div className="w-full lg:w-1/3 lg:pl-6 flex flex-col items-center text-center">
                  <QRCodeCanvas
                    id={`qrcode-${index}`}
                    value={ticketDetails.ticketIds[index]}
                    size={128}
                    includeMargin={true}
                  />
                  <p className="mt-4 text-lg font-semibold">
                    Ticket ID: {ticketDetails.ticketIds[index]}
                  </p>
                  <p className="text-lg">Name: {name}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAddConfirmPage;