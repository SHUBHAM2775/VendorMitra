import React from "react";
import { FaUsers, FaExclamationTriangle, FaRupeeSign, FaShieldAlt } from "react-icons/fa";

const SummaryCards = ({ pendingSuppliers, issues }) => {
  const getSummaryData = () => [
    { 
      label: "Pending Suppliers", 
      value: pendingSuppliers.filter(s => s.status === "pending").length, 
      icon: <FaUsers className="text-yellow-500 text-xl" /> 
    },
    { 
      label: "Rejected Verifications", 
      value: pendingSuppliers.filter(s => s.verificationStatus === "rejected").length, 
      icon: <FaShieldAlt className="text-red-500 text-xl" /> 
    },
    { 
      label: "Open Issues", 
      value: issues.filter(i => i.status === "pending").length, 
      icon: <FaExclamationTriangle className="text-red-500 text-xl" /> 
    },
    { 
      label: "Total Revenue", 
      value: "₹2,45,670", 
      icon: <FaRupeeSign className="text-green-600 text-xl" /> 
    },
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