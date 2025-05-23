import React from "react";
import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffdf8] to-[#f3e9ce] flex items-center justify-center px-4">
      <div className="max-w-lg p-10 text-center bg-white shadow-xl rounded-2xl animate-fade-in">
        <div className="flex justify-center mb-4">
          <Ghost className="w-16 h-16 text-[#c7ae6a]" />
        </div>
        <h1 className="mb-2 text-5xl font-bold text-gray-800">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="mb-6 text-gray-600">
          Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-[#c7ae6a] hover:bg-[#b99a45] text-white font-semibold rounded-full transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
