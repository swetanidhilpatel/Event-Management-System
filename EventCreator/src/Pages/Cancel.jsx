import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Redirect user to home or another page
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500">Payment Canceled</h1>
        <p>Your PayPal transaction has been canceled.</p>
        <button 
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
          onClick={handleGoBack}
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default Cancel;
