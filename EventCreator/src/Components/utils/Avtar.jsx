import React from "react";

const Avtar = ({ firstname, lastname }) => {
  return (
    <div className="h-9 cursor-pointer w-9 rounded-full items-center justify-center font-semibold flex bg-orange-400 text-white">
      {`${firstname.charAt(0).toUpperCase()}${lastname
        .charAt(0)
        .toUpperCase()}`}
    </div>
  );
};

export default Avtar;
