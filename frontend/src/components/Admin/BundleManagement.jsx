import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const BundleManagement = ({
  bundles,
  handleUpdateIssueStatus
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product Bundles</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition">
          + Create Bundle
        </button>
      </div>
      
      {/* Bundle Status Tabs */}
      <div className="flex gap-4 mb-4">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              bundles.some(b => b.status === status)
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({bundles.filter(b => b.status === status).length})
          </button>
        ))}
      </div>

      {bundles.map((bundle) => (
        <div key={bundle.id} className={`border rounded-lg p-4 mb-4 ${
          bundle.status === "pending" ? "border-yellow-300 bg-yellow-50" :
          bundle.status === "approved" ? "border-green-300 bg-green-50" :
          "border-red-300 bg-red-50"
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-semibold text-lg">{bundle.name}</div>
                <span className={`px-2 py-1 rounded text-xs ${
                  bundle.status === "approved" 
                    ? "bg-green-100 text-green-700" 
                    : bundle.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {bundle.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{bundle.description}</div>
              <div className="text-sm mb-2">
                <span className="font-medium">Products:</span> {bundle.products.join(", ")}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="line-through text-gray-500">₹{bundle.originalPrice}</span>
                <span className="font-bold text-green-600">₹{bundle.bundlePrice}</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                  {bundle.discount} OFF
                </span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <FaEdit />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                <FaTrash />
              </button>
              {bundle.status === "pending" && (
                <>
                  <button
                    className="px-3 py-1 rounded text-sm bg-green-100 text-green-700 hover:bg-green-200"
                    onClick={() => handleUpdateIssueStatus(bundle.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1 rounded text-sm bg-red-100 text-red-700 hover:bg-red-200"
                    onClick={() => handleUpdateIssueStatus(bundle.id, "rejected")}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BundleManagement; 