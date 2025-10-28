import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ParticipantsAdd = () => {
  const navigate = useNavigate();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    tickets: "1",
    names: [""],
    ages: [""],
    contactNumber: "",
    selectedName: "", // Field for selected name
    message : "", // Field for message
  });
  const [isAuthorized, setIsAuthorized] = useState(false); // State to manage authorization

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // If no token, redirect to login
        navigate("/login");
        return;
      }

      try {
        // Verify if the user is an admin
        const response = await axios.get(
          "https://event-creator-backend.vercel.app/api/v1/user/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.user.isAdmin) {
          setIsAuthorized(true); // Allow access to the page
        } else {
          navigate("/error"); // Redirect to error page if not admin
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        navigate("/error"); // Redirect to error page on failure
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleTicketsChange = (e) => {
    const numberOfTickets = parseInt(e.target.value);
    const newNames = Array(numberOfTickets)
      .fill("")
      .map((_, i) => formData.names[i] || "");
    const newAges = Array(numberOfTickets)
      .fill("")
      .map((_, i) => formData.ages[i] || "");
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
        : alert("Age must be in 1-100");
    setFormData({
      ...formData,
      ages: newAges,
    });
  };

  const handleSelectName = (e) => {
    const selectedName = e.target.value;
  
    if (selectedName === "") {
      alert("Please select a valid name from the dropdown.");
    } else {
      setFormData({
        ...formData,
        selectedName,
        payid: selectedName, // Set payid to selected name
        pid: selectedName, // Set pid to selected name
      });
    }
  };  

  const handleMessageChange = (e) => {
    const message = e.target.value;
    setFormData({
      ...formData,
      message,
      payid: message, // Set payid to the message
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://event-creator-backend.vercel.app/api/tickets/addtickets",
        formData
      );
      const userid = response.data.userid;
      if (userid) {
        localStorage.setItem("userId", userid);
        navigate("/AdminAddTickets");
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

  if (!isAuthorized) {
    return <div>Loading...</div>; // Display loading message while checking authorization
  }

  return (
    <div className="pt-24">
      <div className="flex flex-col lg:flex-row justify-between max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-semibold mb-6 text-center lg:text-left">
            Admin Add Page
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Email</label>
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
                  style={{ MozAppearance: "textfield" }}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Admin Name
              </label>
              <select
                value={formData.selectedName}
                onChange={handleSelectName}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Select a Name --</option>
                <option value="Nidhil Patel">Nidhil Patel</option>
                <option value="Bhavadip Rakholiya">Bhavadip Rakholiya</option>
                <option value="Mori Vivek">Mori Vivek</option>
                <option value="Yash Fafolawala">Yash Fafolawala</option>
              </select>
            </div>


            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={handleMessageChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="text-center lg:text-left">
              <button
                type="submit"
                className="bg-red-500 text-white py-2 px-6 rounded-full"
              >
                Submit
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
    </div>
  );
};

export default ParticipantsAdd;