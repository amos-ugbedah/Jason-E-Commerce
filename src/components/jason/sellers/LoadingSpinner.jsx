import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-full py-10">
      <div className="w-12 h-12 border-4 border-dashed border-gray-300 border-t-[#1a1a1a] rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
