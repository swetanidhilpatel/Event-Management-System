import React from 'react';

const Logo = () => {
  return (
    <div className="flex justify-center items-center">
      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
        xmlns="http://www.w3.org/2000/svg"
        className="logo"
      >
        {/* Outer circle */}
        <circle cx="75" cy="75" r="70" stroke="#4CAF50" strokeWidth="8" fill="none" />

        {/* Inner letter "M" */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          fill="#4CAF50"
          fontSize="50"
          fontFamily="Arial"
          fontWeight="bold"
          dy=".35em"
        >
          M
        </text>

        {/* Event Text */}
        <text
          x="50%"
          y="85%"
          textAnchor="middle"
          fill="#333"
          fontSize="16"
          fontFamily="Arial"
        >
          Matangi Event
        </text>
      </svg>
    </div>
  );
};

export default Logo;