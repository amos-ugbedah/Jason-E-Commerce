// src/components/ui/button.jsx

import React from "react";

export function Button({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md font-semibold bg-[#1a1a1a] text-white hover:bg-[#000000] transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
