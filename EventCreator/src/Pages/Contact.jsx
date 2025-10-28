// src/components/Contact.js
import React from 'react';

const Contact = () => {
  return (
    <div className="pt-24 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">Contact Us</h2>
        <p className="text-lg mb-4 text-gray-600 text-center">
          This event is organized by <strong>GUJARATI SAMAJ KASSEL</strong>.
        </p>
        <p className="text-lg mb-4 text-gray-600">
          For any inquiries, feel free to reach out to the organizing team:
        </p>
        <ul className="list-none space-y-2 text-lg text-gray-700">
          <li>Nidhil Patel: +4915213864745</li>
          <li>Bhavadip Rakholiya: +4917685973758</li>
          <li>Mori Vivek: +4915758081014</li>
          <li>Yash Fafolawala: +491639052546</li>
          
        </ul>
        <p className="text-lg mt-4 text-gray-700">
          You can also send us an email at: <strong>indianeventkassel@gmail.com</strong>
        </p>
      </div>
    </div>
  );
};

export default Contact;