import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminScannedTickets = () => {
  const [scannedTickets, setScannedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false); // To manage authorization
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  // Check if the user is logged in and admin
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

  // Fetch scanned tickets data
  useEffect(() => {
    if (isAuthorized) {
      const fetchScannedTickets = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "https://event-creator-backend.vercel.app/api/scannedticketlist",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setScannedTickets(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching scanned tickets:", error);
          setLoading(false);
        }
      };

      fetchScannedTickets();
    }
  }, [isAuthorized]);

  if (!isAuthorized || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-24 md:px-12">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-2xl text-[#34A7DD] font-semibold font-sans">
          Scanned Tickets
        </h1>
        <button
          className="bg-[#34A7DD] text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
          onClick={() => navigate("/adminticketscanner")} // Navigate to your scanner page
        >
          Scan Ticket
        </button>
      </div>
  
      <div className="overflow-x-auto border-x md:border-none border-black my-2 ml-2 mr-2 2xl:overflow-x-hidden">
        <table className="table-auto w-full mx-auto border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-4 text-center">No.</th>
              <th className="border border-black p-4 text-center">Ticket ID</th>
              <th className="border border-black p-4 text-center">Name</th>
              <th className="border border-black p-4 text-center">Age</th>
              <th className="border border-black p-4 text-center">Email</th>
              <th className="border border-black p-4 text-center">Contact Number</th>
              <th className="border border-black p-4 text-center">Scan Time</th>
            </tr>
          </thead>
          <tbody>
            {scannedTickets.length > 0 ? (
              scannedTickets.map((ticket, index) => (
                <tr key={ticket.ticketId} className="hover:bg-gray-50">
                  <td className="border border-black p-4 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-black p-4 text-center">
                    {ticket.ticketId}
                  </td>
                  <td className="border border-black p-4 text-center">
                    {ticket.name}
                  </td>
                  <td className="border border-black p-4 text-center">
                    {ticket.age}
                  </td>
                  <td className="border border-black p-4 text-center">
                    {ticket.email}
                  </td>
                  <td className="border border-black p-4 text-center">
                    {ticket.contactNumber}
                  </td>
                  <td className="border border-black p-4 text-center">
                    {new Date(ticket.scanTime).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border border-black p-4 text-center">
                  No tickets scanned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminScannedTickets;
