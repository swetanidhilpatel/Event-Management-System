import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ParticipantsList = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0); // New state for total tickets
  const [isAuthorized, setIsAuthorized] = useState(false);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "https://event-creator-backend.vercel.app/api/v1/user/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.user.isAdmin) {
          setIsAuthorized(true);
        } else {
          navigate("/error");
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        navigate("/error");
      }
    };

    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    if (isAuthorized) {
      const fetchParticipants = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "https://event-creator-backend.vercel.app/api/participants",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setParticipants(response.data);

          const total = response.data.reduce((sum, participant) => {
            return sum + participant.totalPrice;
          }, 0);
          setTotalAmount(total);

          // Calculate total tickets
          const tickets = response.data.reduce((sum, participant) => {
            return sum + participant.numberOfTickets; // Sum up numberOfTickets
          }, 0);
          setTotalTickets(tickets); // Set total tickets

          setLoading(false);
        } catch (error) {
          console.error("Error fetching participants:", error);
          setLoading(false);
        }
      };

      fetchParticipants();
    }
  }, [isAuthorized]);

  const handleDelete = async (userid) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://event-creator-backend.vercel.app/api/participants/delete/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setParticipants((prevParticipants) =>
        prevParticipants.filter((participant) => participant.userid !== userid)
      );

      const total = participants
        .filter((participant) => participant.userid !== userid)
        .reduce((sum, participant) => sum + participant.totalPrice, 0);
      setTotalAmount(total);

      // Update total tickets
      const updatedTickets = participants
        .filter((participant) => participant.userid !== userid)
        .reduce((sum, participant) => sum + participant.numberOfTickets, 0);
      setTotalTickets(updatedTickets); // Update total tickets
    } catch (error) {
      console.error("Error deleting participant:", error);
    }
  };

  const downloadPDF = async () => {
    const input = document.getElementById("participant-table");
    
    // Create a canvas from the table
    const canvas = await html2canvas(input, { 
      scale: 2,
      scrollX: 0,
      scrollY: 0 
    });
    
    const imgData = canvas.toDataURL("image/png");
    
    // Create a new PDF document in landscape orientation
    const pdf = new jsPDF("l", "mm", "a4"); // Use "a4" for A4 paper size in landscape orientation
  
    // Calculate image dimensions
    const imgWidth = pdf.internal.pageSize.getWidth(); // Full width of the page
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
    
    // Add the image to PDF
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  
    // Check if the image height exceeds the page height
    if (imgHeight > pdf.internal.pageSize.getHeight()) {
      let offsetY = 0; // Initial Y offset for positioning
      
      // While there is still more content to add
      while (offsetY < imgHeight) {
        // Add image to the PDF, adjusting the offset for subsequent pages
        pdf.addImage(imgData, "PNG", 0, -offsetY, imgWidth, imgHeight);
        pdf.addPage(); // Add a new page
        offsetY += pdf.internal.pageSize.getHeight(); // Increase the offset
      }
    }
  
    // Save the PDF
    pdf.save("participants-list.pdf");
  };  
  

  if (!isAuthorized || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-24 md:px-12">
      <div className="head flex justify-between px-2">
        <h1 className="text-2xl text-[#34A7DD] font-semibold font-sans">
          Participants
        </h1>
        <button
          className="bg-[#34A7DD] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#2b8ab5] transition-all"
          onClick={() => navigate("/participantsadd")}
        >
          Add
        </button>
      </div>
      <div
        id="participant-table"
        className="overflow-x-auto border-x md:border-none border-black my-2 ml-2 mr-2 2xl:overflow-x-hidden"
      >
        <table className="table-auto w-full mx-auto border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-4 text-center">No.</th>
              <th className="border border-black p-4 text-center">User Id</th>
              <th className="border border-black p-4 text-center">Email</th>
              <th className="border border-black p-4 text-center">
                Contact No.
              </th>
              <th className="border border-black p-4 text-center">
                No. Of Tickets
              </th>
              <th className="border border-black p-4 text-center">Ticket Id</th>
              <th className="border border-black p-4 text-center">Name</th>
              <th className="border border-black p-4 text-center">Age</th>
              <th className="border border-black p-4 text-center">
                Payment ID
              </th>
              <th className="border border-black p-4 text-center">Payer ID</th>
              <th className="border border-black p-4 text-center">
                Total Price
              </th>
              <th className="border border-black p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.length > 0 ? (
              participants.map((participant, index) =>
                participant.names.map((name, nameIndex) => (
                  <tr
                    key={nameIndex}
                    className={`hover:bg-gray-50 ${
                      nameIndex === 0 ? "" : "border-t-0"
                    }`}
                  >
                    {nameIndex === 0 ? (
                      <td
                        rowSpan={participant.names.length}
                        className="border border-black p-4 text-center"
                      >
                        {index + 1} {/* Participant number */}
                      </td>
                    ) : null}

                    {nameIndex === 0 ? (
                      <td
                        rowSpan={participant.names.length}
                        className="border border-black p-4 text-center"
                      >
                        {participant.userid}
                      </td>
                    ) : null}

                    {nameIndex === 0 ? (
                      <td
                        rowSpan={participant.names.length}
                        className="border border-black p-4 text-center"
                      >
                        {participant.email}
                      </td>
                    ) : null}

                    {nameIndex === 0 ? (
                      <td
                        rowSpan={participant.names.length}
                        className="border border-black p-4 text-center"
                      >
                        {participant.contactNumber}
                      </td>
                    ) : null}

                    {nameIndex === 0 ? (
                      <td
                        rowSpan={participant.names.length}
                        className="border border-black p-4 text-center"
                      >
                        {participant.numberOfTickets}
                      </td>
                    ) : null}

                    <td className="border border-black p-4 text-center">
                      {participant.ticketIds[nameIndex]}
                    </td>
                    <td className="border border-black p-4 text-center">
                      {name}
                    </td>
                    <td className="border border-black p-4 text-center">
                      {participant.ages[nameIndex]}
                    </td>

                    {nameIndex === 0 ? (
                      <td
                        rowSpan={participant.names.length}
                        className="border border-black p-4 text-center"
                      >
                        {participant.payid}
                      </td>
                    ) : null}

                    {nameIndex === 0 ? (
                      <td
                        rowSpan={participant.names.length}
                        className="border border-black p-4 text-center"
                      >
                        {participant.pid}
                      </td>
                    ) : null}

                    {nameIndex === 0 ? (
                      <td
                        rowSpan={participant.names.length}
                        className="border border-black p-4 text-center"
                      >
                        €{participant.totalPrice}
                      </td>
                    ) : null}

                    {nameIndex === 0 ? (
                      <td
                        rowSpan={participant.names.length}
                        className="border border-black p-4 text-center"
                      >
                        <button
                          onClick={() => handleDelete(participant.userid)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className="border border-black p-4 text-center"
                >
                  No participants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between px-2 mt-4">
        <h2 className="text-xl">Total Participants: {participants.length}</h2>
        <h2 className="text-xl">Total Tickets: {totalTickets}</h2>{" "}
        {/* Display total tickets */}
        <h2 className="text-xl">Total Amount: €{totalAmount}</h2>
        <button
          onClick={downloadPDF}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ParticipantsList;
