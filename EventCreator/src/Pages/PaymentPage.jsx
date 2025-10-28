import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const [loading, setLoading] = useState(true);
  const [ticketId, setTicketId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Extract the ticketId from the URL parameters
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("ticketId");

    // If ticketId is missing, redirect the user to the home page
    if (!id) {
      navigate("/");
    } else {
      setTicketId(id);
      setLoading(false);
    }
  }, [location.search, navigate]);

  // Handle payment for the normal "Proceed to Payment" button
  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
      const res = await axios.post(
        `https://event-creator-backend.vercel.app/api/payment/${userId}`
      );

      if (res && res.data) {
        window.location.href = res.data.links[1].href; // Redirect to PayPal or payment URL
      }
    } catch (error) {
      console.error("Error:", error);
      setPaymentStatus("Payment failed. Please try again.");
    }
  };

  return (
    <div className="pt-24">
      <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Payment Page
        </h2>
        {loading ? (
          <p className="text-center">Loading payment information...</p>
        ) : (
          <div className="text-center">
            {/* Proceed to Payment Button */}
            <button
              className="px-4 py-2 rounded-md text-white bg-[#FB923C] mb-4"
              onClick={handlePayment}
            >
              Proceed to Payment
            </button>

            {/* Display payment status messages */}
            {paymentStatus && (
              <p className="mt-4 text-center text-red-500">{paymentStatus}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
