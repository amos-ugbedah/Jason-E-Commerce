import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  // Automatically redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/seller-registration");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fefefe] to-[#f3e9ce] text-center px-4">
      <div className="w-full max-w-md p-10 bg-white shadow-xl rounded-2xl animate-fade-in">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="mb-2 text-3xl font-extrabold text-gray-800">Unauthorized Access</h1>
        <p className="mb-4 text-gray-600">
          This page is restricted to verified sellers. To access the seller dashboard, you need to register as a seller.
        </p>
        <p className="mb-6 text-sm text-gray-500">Redirecting you in a few seconds...</p>
        <Link
          to="/seller-registration"
          className="inline-block px-6 py-3 bg-[#c7ae6a] hover:bg-[#b99a45] text-white font-semibold rounded-full transition duration-300"
        >
          Become a Seller Now
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
