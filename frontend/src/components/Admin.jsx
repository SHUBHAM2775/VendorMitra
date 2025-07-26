import React, { useState } from "react";
import { FaUsers, FaBox, FaExclamationTriangle, FaRupeeSign, FaCheck, FaTimes, FaEdit, FaTrash, FaEye, FaDownload, FaShieldAlt } from "react-icons/fa";

const Admin = () => {
  const [tab, setTab] = useState("Suppliers");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  
  // Sample data for suppliers pending approval with verification details
  const [pendingSuppliers, setPendingSuppliers] = useState([
    {
      id: "SUP001",
      name: "Fresh Farm Supplies",
      email: "freshfarm@email.com",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra",
      products: ["Grains", "Vegetables", "Dairy"],
      submittedDate: "2024-01-15",
      status: "pending",
      verificationStatus: "pending",
      verificationDetails: {
        businessName: "Fresh Farm Supplies Pvt Ltd",
        fssaiNumber: "12345678901234",
        certificateType: "FSSAI",
        businessAddress: "Shop No. 45, Andheri West, Mumbai - 400058",
        contactPerson: "Rajesh Kumar",
        phoneNumber: "+91 98765 43210",
        email: "freshfarm@email.com",
        certificateFile: {
          name: "FSSAI_License_FreshFarm.pdf",
          url: "#", // In real app, this would be the actual file URL
          type: "application/pdf"
        },
        submittedDate: "2024-01-15"
      }
    },
    {
      id: "SUP002", 
      name: "Organic Valley",
      email: "organicvalley@email.com",
      phone: "+91 98765 43211",
      location: "Pune, Maharashtra",
      products: ["Organic Products", "Spices"],
      submittedDate: "2024-01-14",
      status: "pending",
      verificationStatus: "pending",
      verificationDetails: {
        businessName: "Organic Valley Foods",
        fssaiNumber: "98765432109876",
        certificateType: "FSSAI",
        businessAddress: "B-12, Koregaon Park, Pune - 411001",
        contactPerson: "Priya Sharma",
        phoneNumber: "+91 98765 43211",
        email: "organicvalley@email.com",
        certificateFile: {
          name: "FSSAI_License_OrganicValley.jpg",
          url: "#", // In real app, this would be the actual file URL
          type: "image/jpeg"
        },
        submittedDate: "2024-01-14"
      }
    },
    {
      id: "SUP003",
      name: "Spice Traders Co.",
      email: "spicetraders@email.com",
      phone: "+91 98765 43212",
      location: "Delhi, NCR",
      products: ["Spices", "Dry Fruits"],
      submittedDate: "2024-01-13",
      status: "pending",
      verificationStatus: "verified",
      verificationDetails: {
        businessName: "Spice Traders Company",
        fssaiNumber: "11223344556677",
        certificateType: "FSSAI",
        businessAddress: "Shop 78, Connaught Place, New Delhi - 110001",
        contactPerson: "Amit Patel",
        phoneNumber: "+91 98765 43212",
        email: "spicetraders@email.com",
        certificateFile: {
          name: "FSSAI_License_SpiceTraders.pdf",
          url: "#",
          type: "application/pdf"
        },
        submittedDate: "2024-01-13",
        verifiedDate: "2024-01-14",
        verifiedBy: "Admin"
      }
    }
  ]);

  // Sample data for bundles
  const [bundles, setBundles] = useState([
    {
      id: "BUN001",
      name: "Kitchen Essentials",
      description: "Complete kitchen starter pack",
      products: ["Basmati Rice", "Turmeric Powder", "Cooking Oil"],
      originalPrice: 3500,
      bundlePrice: 2800,
      discount: "20%",
      status: "active"
    },
    {
      id: "BUN002",
      name: "Organic Wellness",
      description: "Organic health products bundle",
      products: ["Organic Honey", "Green Tea", "Almonds"],
      originalPrice: 1200,
      bundlePrice: 900,
      discount: "25%",
      status: "active"
    }
  ]);

  // Sample data for user issues
  const [issues, setIssues] = useState([
    {
      id: "ISS001",
      user: "Raj Kumar",
      email: "raj@email.com",
      subject: "Order not delivered",
      description: "Order #ORD001 was supposed to be delivered yesterday but still not received",
      priority: "high",
      status: "open",
      submittedDate: "2024-01-15"
    },
    {
      id: "ISS002",
      user: "Priya Sharma",
      email: "priya@email.com", 
      subject: "Wrong product received",
      description: "Received different product than ordered",
      priority: "medium",
      status: "in_progress",
      submittedDate: "2024-01-14"
    }
  ]);

  // Summary data
  const getSummaryData = () => [
    { 
      label: "Pending Suppliers", 
      value: pendingSuppliers.filter(s => s.status === "pending").length, 
      icon: <FaUsers className="text-yellow-500 text-xl" /> 
    },
    { 
      label: "Pending Verification", 
      value: pendingSuppliers.filter(s => s.verificationStatus === "pending").length, 
      icon: <FaShieldAlt className="text-blue-500 text-xl" /> 
    },
    { 
      label: "Open Issues", 
      value: issues.filter(i => i.status === "open").length, 
      icon: <FaExclamationTriangle className="text-red-500 text-xl" /> 
    },
    { 
      label: "Total Revenue", 
      value: "₹2,45,670", 
      icon: <FaRupeeSign className="text-green-600 text-xl" /> 
    },
  ];

  // Handlers for supplier approval
  const handleApproveSupplier = (supplierId) => {
    setPendingSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId ? { ...supplier, status: "approved" } : supplier
    ));
  };

  const handleRejectSupplier = (supplierId) => {
    setPendingSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId ? { ...supplier, status: "rejected" } : supplier
    ));
  };

  // Handlers for verification
  const handleVerifySupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setShowVerificationModal(true);
  };

  const handleApproveVerification = (supplierId) => {
    setPendingSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId ? { 
        ...supplier, 
        verificationStatus: "verified",
        verificationDetails: {
          ...supplier.verificationDetails,
          verifiedDate: new Date().toISOString().split('T')[0],
          verifiedBy: "Admin"
        }
      } : supplier
    ));
    setShowVerificationModal(false);
  };

  const handleRejectVerification = (supplierId) => {
    setPendingSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId ? { 
        ...supplier, 
        verificationStatus: "rejected",
        verificationDetails: {
          ...supplier.verificationDetails,
          rejectedDate: new Date().toISOString().split('T')[0],
          rejectedBy: "Admin"
        }
      } : supplier
    ));
    setShowVerificationModal(false);
  };

  const handleDownloadFile = (file) => {
    // In real app, this would download the actual file
    console.log("Downloading file:", file.name);
    // For demo, we'll just show an alert
    alert(`Downloading ${file.name}`);
  };

  // Handlers for bundle management
  const handleToggleBundle = (bundleId) => {
    setBundles(prev => prev.map(bundle => 
      bundle.id === bundleId ? { ...bundle, status: bundle.status === "active" ? "inactive" : "active" } : bundle
    ));
  };

  // Handlers for issue management
  const handleUpdateIssueStatus = (issueId, newStatus) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
  };

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {/* Summary Cards */}
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

      {/* Tab Navigation */}
      <div className="px-8">
        <div className="bg-white rounded-t-lg shadow">
          <div className="flex border-b">
            {["Suppliers", "Bundles", "Issues"].map((tabName) => (
              <button
                key={tabName}
                className={`px-6 py-3 font-medium transition ${
                  tab === tabName
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setTab(tabName)}
              >
                {tabName}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow mx-0 mb-8 p-6 mt-0">
          {tab === "Suppliers" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Supplier Approval</h2>
              {pendingSuppliers.filter(s => s.status === "pending").map((supplier) => (
                <div key={supplier.id} className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="font-semibold text-lg">{supplier.name}</div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          supplier.verificationStatus === "verified" 
                            ? "bg-green-100 text-green-700" 
                            : supplier.verificationStatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {supplier.verificationStatus === "verified" ? "✓ Verified" :
                           supplier.verificationStatus === "rejected" ? "✗ Rejected" :
                           "⏳ Pending Verification"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{supplier.email} · {supplier.phone}</div>
                      <div className="text-sm text-gray-500 mb-2">{supplier.location}</div>
                      <div className="text-sm">
                        <span className="font-medium">Products:</span> {supplier.products.join(", ")}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Submitted: {supplier.submittedDate}</div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
                        onClick={() => handleVerifySupplier(supplier)}
                      >
                        <FaEye className="text-sm" />
                        Verify
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
                        onClick={() => handleRejectSupplier(supplier.id)}
                      >
                        <FaTimes className="text-sm" />
                        Reject
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
                        onClick={() => handleApproveSupplier(supplier.id)}
                      >
                        <FaCheck className="text-sm" />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingSuppliers.filter(s => s.status === "pending").length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No pending suppliers to approve
                </div>
              )}
            </div>
          )}

          {tab === "Bundles" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Product Bundles</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition">
                  + Create Bundle
                </button>
              </div>
              {bundles.map((bundle) => (
                <div key={bundle.id} className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="font-semibold text-lg">{bundle.name}</div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          bundle.status === "active" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
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
                      <button
                        className={`px-3 py-1 rounded text-sm ${
                          bundle.status === "active"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                        onClick={() => handleToggleBundle(bundle.id)}
                      >
                        {bundle.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "Issues" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">User Issues</h2>
              {issues.map((issue) => (
                <div key={issue.id} className={`border-l-4 p-4 rounded mb-4 ${
                  issue.priority === "high" ? "border-red-400 bg-red-50" :
                  issue.priority === "medium" ? "border-yellow-400 bg-yellow-50" :
                  "border-blue-400 bg-blue-50"
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="font-semibold">{issue.subject}</div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          issue.priority === "high" ? "bg-red-100 text-red-700" :
                          issue.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {issue.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          issue.status === "open" ? "bg-red-100 text-red-700" :
                          issue.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {issue.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{issue.user} · {issue.email}</div>
                      <div className="text-sm text-gray-700 mb-2">{issue.description}</div>
                      <div className="text-xs text-gray-400">Submitted: {issue.submittedDate}</div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {issue.status === "open" && (
                        <button
                          className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-sm"
                          onClick={() => handleUpdateIssueStatus(issue.id, "in_progress")}
                        >
                          Start
                        </button>
                      )}
                      {issue.status === "in_progress" && (
                        <button
                          className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 text-sm"
                          onClick={() => handleUpdateIssueStatus(issue.id, "resolved")}
                        >
                          Resolve
                        </button>
                      )}
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Verification Details - {selectedSupplier.name}
              </h2>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Business Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Name</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedSupplier.verificationDetails.businessName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Address</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedSupplier.verificationDetails.businessAddress}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedSupplier.verificationDetails.contactPerson}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedSupplier.verificationDetails.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedSupplier.verificationDetails.email}</p>
                    </div>
                  </div>
                </div>

                {/* Certificate Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Certificate Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Certificate Type</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedSupplier.verificationDetails.certificateType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">FSSAI Number / License Number</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedSupplier.verificationDetails.fssaiNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Submitted Date</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedSupplier.verificationDetails.submittedDate}</p>
                    </div>
                    {selectedSupplier.verificationDetails.verifiedDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Verified Date</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedSupplier.verificationDetails.verifiedDate}</p>
                      </div>
                    )}
                    {selectedSupplier.verificationDetails.rejectedDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rejected Date</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedSupplier.verificationDetails.rejectedDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Certificate File */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Certificate File</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <FaDownload className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedSupplier.verificationDetails.certificateFile.name}</p>
                        <p className="text-sm text-gray-500">{selectedSupplier.verificationDetails.certificateFile.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(selectedSupplier.verificationDetails.certificateFile)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <FaDownload className="text-sm" />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Verification Links */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Verification Resources</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 mb-2">
                    <strong>FSSAI License Verification:</strong> Check the license number on the official FSSAI portal
                  </p>
                  <a
                    href="https://foscos.fssai.gov.in/verification/license"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    https://foscos.fssai.gov.in/verification/license
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedSupplier.verificationStatus === "pending" && (
                  <>
                    <button
                      onClick={() => handleRejectVerification(selectedSupplier.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Reject Verification
                    </button>
                    <button
                      onClick={() => handleApproveVerification(selectedSupplier.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                    >
                      Approve Verification
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 