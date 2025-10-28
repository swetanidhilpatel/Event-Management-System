import React from "react";
import { useNavigate } from "react-router-dom";

const HomeContent = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full py-10 px-14 bg-zinc-100 shadow-lg rounded-lg">
      {/* Main Content Wrapper */}
      <div className="flex flex-col justify-between lg:flex-row">
        {/* Left Section: Event Details */}
        <div className="lg:w-2/3">
          {/* Header Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold mb-2">Garba Night Kassel - 2024</h1>
            <div className="flex justify-center lg:justify-start items-center text-gray-500 text-sm space-x-4">
              <span className="flex items-center">📅 October 05, 03:00 PM</span>
              <span className="flex items-center">
                📍 Kulturzentrum Färberei, Universitätplatz 10, 34127 Kassel
              </span>
            </div>
          </div>

          {/* About Event Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">About Event</h2>
            <div className="mt-4 text-gray-700">
              <p className="flex items-center">
                🌟 <strong className="ml-2">Organised by GUJARATI SAMAJ KASSEL</strong>
              </p>
              <p className="flex items-center">
                🌟 <strong className="ml-2">Event coordinated with Asta at the University of Kassel."</strong>
              </p>
              <p className="flex items-center">
                🌟{" "}
                <strong className="ml-2">Experience the Vibrant Navaratri Fiesta Europe 2024!</strong>
              </p>
            </div>
            <ul className="mt-6 text-gray-700 space-y-2">
              <li>✨ Unforgettable Celebration of Indian Culture and Traditions!</li>
              <li>💃 Electrifying Garba and Dandiya Raas!</li>
            </ul>
          </div>

          {/* Participation Fees Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Participation Fees (Food and Dandiya Included)</h2>
            <ul className="mt-4 text-gray-700 space-y-2">
              <li>Children below 8 years of age: <strong>Free Entry</strong></li>
              <li>Children 8 - 13 years of age: <strong>5 €</strong></li>
              <li>Above 13 years: <strong>15 € per person</strong></li>
            </ul>
          </div>

          {/* Book Now Button */}
          <div className="mt-8 text-center lg:text-left">
            <button
              onClick={() => navigate("/booknow")}
              className="bg-red-500 text-white py-2 px-8 rounded-full hover:bg-red-600"
            >
              BOOK NOW
            </button>
          </div>
        </div>

        {/* Right Section: Map */}
        <div className="lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
          <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Event Location"
              className="w-full h-64"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2493.2248111679532!2d9.50307937525859!3d51.32538472398555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bb39b011c93019%3A0xd7370d174fee32b!2sKulturzentrum%20F%C3%84RBEREI!5e0!3m2!1sen!2sde!4v1725398181525!5m2!1sen!2sde"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;