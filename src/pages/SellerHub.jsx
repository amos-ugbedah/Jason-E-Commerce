import React from 'react';
import { useNavigate } from 'react-router-dom';

const SellerHub = () => {
  const navigate = useNavigate();
  // const { userInfo } = useSelector((state) => state.auth); // Removed as it is not used

  const features = [
    {
      title: "Dashboard",
      description: "View your sales and performance metrics",
      path: "/seller/dashboard"
    },
    {
      title: "Product Management",
      description: "Add, edit, and manage your products",
      path: "/seller/products"
    },
    {
      title: "Order Management",
      description: "View and process customer orders",
      path: "/seller/orders"
    },
    {
      title: "Analytics",
      description: "Track your sales and customer behavior",
      path: "/seller/analytics"
    },
    {
      title: "Profile Settings",
      description: "Update your seller profile information",
      path: "/seller/profile"
    },
    {
      title: "Support Center",
      description: "Get help with your seller account",
      path: "/seller/support"
    }
  ];

  return (
    <div className="px-4 py-12 mx-auto max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">Seller Hub</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div 
            key={index}
            onClick={() => navigate(feature.path)}
            className="p-6 transition-colors bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50"
          >
            <h2 className="mb-2 text-xl font-semibold">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerHub;