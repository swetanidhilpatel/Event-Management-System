import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
const TicketRegistration = () => {
  axios.defaults.withCredentials = true;
  const [formData, setFormData] = useState({
    email: "",
    tickets: "1",
    names: [""],
    ages: [""], // Added age array
    contactNumber: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false); // New state for terms acceptance
  const [showTermsModal, setShowTermsModal] = useState(false); // State to control modal visibility
  const handleTicketsChange = (e) => {
    const numberOfTickets = parseInt(e.target.value);
    const newNames = Array(numberOfTickets)
      .fill("")
      .map((_, i) => formData.names[i] || "");
    const newAges = Array(numberOfTickets)
      .fill("")
      .map((_, i) => formData.ages[i] || ""); // Ensure ages array updates with tickets
    setFormData({
      ...formData,
      tickets: e.target.value,
      names: newNames,
      ages: newAges,
    });
  };

  const handleNameChange = (index, e) => {
    const newNames = [...formData.names];
    newNames[index] = e.target.value;
    setFormData({
      ...formData,
      names: newNames,
    });
  };

  const handleAgeChange = (index, e) => {
    const newAges = [...formData.ages];
    newAges[index] =
      e.target.value > 0 && e.target.value < 100
        ? e.target.value
        : alert("Age Must be in 1-100");
    setFormData({
      ...formData,
      ages: newAges,
    });
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("You must accept the terms and conditions to register.");
      return;
    }
    try {
      const response = await axios.post(
        "https://event-creator-backend.vercel.app/api/tickets",
        formData
      );
      const userid = response.data.userid;
      if (userid) {
        localStorage.setItem("userId", userid);
        window.location.href = `/paymentpage?ticketId=${userid}`;
      }
    } catch (err) {
      console.error("Error submitting form data:", err);
    }
  };

  const calculateTotalPrice = () => {
    return formData.ages.reduce((total, age) => {
      if (age > 13) return total + 15;
      else if (age >= 8 && age <= 13) return total + 5;
      return total;
    }, 0);
  };

  return (
    <div className="pt-24">
      <div className="flex flex-col lg:flex-row justify-between max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-semibold mb-6 text-center lg:text-left">
            Event Ticket Registration
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Contact Number
              </label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Number of Tickets
              </label>
              <select
                value={formData.tickets}
                onChange={handleTicketsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {formData.names.map((name, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Name for Ticket {index + 1}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <label className="block text-gray-700 font-bold mb-2 mt-4">
                  Age for Ticket {index + 1}
                </label>
                <input
                  type="number"
                  value={formData.ages[index]}
                  onChange={(e) => handleAgeChange(index, e)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none"
                  style={{ MozAppearance: "textfield" }} // For Firefox
                  onWheel={(e) => e.target.blur()} // Disable scrolling in input
                />
              </div>
            ))}

<div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-gray-700">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)} // Open modal on click
                  className="text-blue-500 underline"
                >
                  Terms & Conditions
                </button>
              </label>
            </div>

            <div className="text-center lg:text-left">
              <button
                type="submit"
                className="bg-red-500 text-white py-2 px-6 rounded-full"
              >
                Register
              </button>
            </div>
          </form>
        </div>

        <div className="lg:w-1/3 lg:pl-6 mt-8 lg:mt-0">
          <div className="sticky top-6 p-6 bg-gray-100 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Summary</h3>
            <p className="text-lg font-bold">
              Total Price: €{calculateTotalPrice()}
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Terms & Conditions */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full relative">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              Terms and Conditions
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                <strong>Non-Refundable Ticket:</strong> All tickets purchased
                are non-refundable. Once the payment is processed, it cannot be
                refunded.
              </li>
              <li>
                <strong>Non-Transferable:</strong> Tickets are non-transferable.
                They cannot be transferred to another person or event.
              </li>
              <li>
                <strong>ID Proof is Required:</strong> A valid ID proof is
                required for entry to the event. Please bring an official ID
                with you.
              </li>
              <li>
                <strong>No Objection to Post Event Photos:</strong> By attending
                the event, you consent to the use of your image in promotional
                materials and on social media.
              </li>
              <li>
                <strong>Age Restrictions:</strong> Minors under 18 must be
                accompanied by a legal guardian.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketRegistration;
