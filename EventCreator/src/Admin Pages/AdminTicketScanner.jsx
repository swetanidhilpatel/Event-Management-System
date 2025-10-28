import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminTicketScanner = () => {
  const navigate = useNavigate();
  const [data, setData] = useState("No result");
  const [ticketDetails, setTicketDetails] = useState(null);
  const [manualTicketId, setManualTicketId] = useState("");
  const [alreadyScanned, setAlreadyScanned] = useState(false);
  const [scannedTime, setScannedTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  axios.defaults.withCredentials = true;

  // Check user authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
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

        if (!response.data.user.isAdmin) {
          navigate("/error");
        }
      } catch (error) {
        console.error("Error checking user authentication:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch ticket details based on the scanned QR code or manually entered ticket ID
  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await axios.get(
        `https://event-creator-backend.vercel.app/api/tickets/userticket/${ticketId}`
      );
      setTicketDetails(response.data);
      setAlreadyScanned(false);
      setScannedTime(null);
      setErrorMessage("");
      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setAlreadyScanned(true);
        setScannedTime(error.response.data.scannedAt);
        setTicketDetails({
          ticketId,
          name: error.response.data.name,
        });
      } else {
        setErrorMessage("Error fetching ticket details");
        setTicketDetails(null);
      }
      console.error("Error fetching ticket details:", error);
    }
  };

  useEffect(() => {
    if (data !== "No result") {
      fetchTicketDetails(data);
    }
  }, [data]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualTicketId) {
      fetchTicketDetails(manualTicketId);
      setManualTicketId("");
    }
  };

  const handleCameraToggle = () => {
    setCameraActive(!cameraActive);
  };

  return (
    <div className="lg:pt-12 pt-4 flex flex-col lg:flex-row items-start lg:justify-start min-h-screen bg-gray-100 px-4 py-6">
      <div
        className={`w-full lg:w-1/3 xl:w-1/4 flex flex-col lg:mr-6 ${
          cameraActive ? "pt-0" : "pt-[38px]"
        } lg:${cameraActive ? "pt-0" : "pt-[70px]"}`}
      >
        <div
          className={`relative w-full ${
            cameraActive ? "h-0 pb-[100%]" : "h-0"
          }`}
        >
          {cameraActive && (
            <QrReader
              onResult={(result, error) => {
                if (result) {
                  setData(result?.text);
                }
                if (error) {
                  console.info(error);
                }
              }}
              constraints={{ facingMode: "environment" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </div>

        <button
          onClick={handleCameraToggle}
          className="mb-4 mt-5 md:mt-[60px] lg:mt-0 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          {cameraActive ? "Turn Camera Off" : "Turn Camera On"}
        </button>

        <div className="w-full bg-white shadow-lg rounded-lg p-4 border border-gray-200">
          <form onSubmit={handleManualSubmit}>
            <label htmlFor="ticketId" className="block text-lg font-bold mb-2">
              Enter Ticket ID:
            </label>
            <input
              type="text"
              id="ticketId"
              value={manualTicketId}
              onChange={(e) => setManualTicketId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Enter Ticket ID"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <div
        className={`w-full lg:w-1/3 xl:w-1/4 shadow-lg rounded-lg p-4 border ${
          alreadyScanned
            ? "border-red-500 shadow-red-500/50"
            : ticketDetails
            ? "border-green-500 shadow-green-500/50"
            : "border-gray-200"
        } lg:mt-[36px] mt-6`}
      >
        {ticketDetails ? (
          alreadyScanned ? (
            <div className="text-red-600">
              <h2 className="text-lg font-bold mb-2">Ticket Already Scanned</h2>
              <p>
                <strong>Ticket ID:</strong> {ticketDetails.ticketId}
              </p>
              <p>
                <strong>Name:</strong> {ticketDetails.name}
              </p>
              <p>
                <strong>Scanned At:</strong>{" "}
                {new Date(scannedTime).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="text-green-600">
              <h2 className="text-lg font-bold mb-2">Ticket Details:</h2>
              <p>
                <strong>Ticket ID:</strong> {ticketDetails.ticketId}
              </p>
              <p>
                <strong>Name:</strong> {ticketDetails.name}
              </p>
              <p>
                <strong>Age:</strong> {ticketDetails.age}
              </p>
              <p>
                <strong>Email:</strong> {ticketDetails.email}
              </p>
              <p>
                <strong>Contact Number:</strong> {ticketDetails.contactNumber}
              </p>
              <p>
                <strong>Number of Tickets:</strong>{" "}
                {ticketDetails.numberOfTickets}
              </p>
              {ticketDetails.qrCodeImage && (
                <p>
                  <strong>QR Code Image:</strong>{" "}
                  <img src={ticketDetails.qrCodeImage} alt="QR Code" />
                </p>
              )}
              <p>
                <strong>Total Price:</strong> €{ticketDetails.totalPrice}
              </p>
            </div>
          )
        ) : errorMessage ? (
          <p className="text-lg font-medium text-red-500">{errorMessage}</p>
        ) : (
          <p className="text-lg font-medium">
            Scan a QR code or enter a Ticket ID to see ticket details.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminTicketScanner;