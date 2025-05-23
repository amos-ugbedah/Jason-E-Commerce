// src/pages/MaintenancePage.jsx
import React from "react";

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold text-gray-800">We'll be back soon!</h1>
      <p className="max-w-md text-lg text-center text-gray-600">
        Our website is currently undergoing scheduled maintenance.
        Thank you for your patience. Please check back later.
      </p>
    </div>
  );
}
