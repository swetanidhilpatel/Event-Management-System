import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="pt-24 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Terms and Conditions</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Non-Refundable Ticket:</strong> All tickets purchased are non-refundable. Once the payment is processed, it cannot be refunded.
          </li>
          <li>
            <strong>Non-Transferable:</strong> Tickets are non-transferable. They cannot be transferred to another person or event.
          </li>
          <li>
            <strong>ID Proof is Required:</strong> A valid ID proof is required for entry to the event. Please bring an official ID with you.
          </li>
          <li>
            <strong>No Objection to Post Event Photos:</strong> By attending the event, you consent to the use of your image in promotional materials and on social media.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TermsAndConditions;