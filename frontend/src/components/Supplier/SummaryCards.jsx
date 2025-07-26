import React from "react";
import { FaBox, FaShoppingCart, FaTruck, FaRupeeSign } from "react-icons/fa";

const SummaryCards = ({ products, orders }) => {
  const getSummaryData = () => [
    { label: "Total Products", value: products.length, icon: <FaBox className="text-green-600 text-xl" /> },
    { label: "Pending Orders", value: orders.filter(order => order.status === "pending").length, icon: <FaShoppingCart className="text-yellow-500 text-xl" /> },
    { label: "In Transit", value: orders.filter(order => order.status === "dispatched").length, icon: <FaTruck className="text-blue-500 text-xl" /> },
    { label: "Monthly Revenue", value: "₹45,670", icon: <FaRupeeSign className="text-green-600 text-xl" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-8 py-6">
      {getSummaryData().map((item) => (
        <div key={item.label} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div>{item.icon}</div>
          <div>
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="text-xl font-bold text-gray-800">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards; 