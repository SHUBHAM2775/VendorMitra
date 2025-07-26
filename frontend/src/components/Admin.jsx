import React, { useState } from "react";
import SummaryCards from "./admin/SummaryCards";
import TabNavigation from "./admin/TabNavigation";
import SupplierManagement from "./admin/SupplierManagement";
import BundleManagement from "./admin/BundleManagement";
import IssueManagement from "./admin/IssueManagement";
import VerificationModal from "./admin/VerificationModal";

const Admin = () => {
  const [tab, setTab] = useState("Pending");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Split suppliers into pending, accepted, rejected
  const [pendingSuppliers, setPendingSuppliers] = useState([
    {
      id: "SUP001",
      name: "Fresh Farm Supplies",
      fssaiLicenseNumber: "12345678901234",
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
      fssaiLicenseNumber: "98765432109876",
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
    }
  ]);
  const [acceptedSuppliers, setAcceptedSuppliers] = useState([]);
  const [rejectedSuppliers, setRejectedSuppliers] = useState([
    {
      id: "SUP003",
      name: "Spice Traders Co.",
      fssaiLicenseNumber: "11223344556677",
      submittedDate: "2024-01-13",
      status: "rejected",
      verificationStatus: "rejected",
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
        rejectedDate: "2024-01-14",
        rejectedBy: "Admin"
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
      status: "pending"
    },
    {
      id: "BUN002",
      name: "Organic Wellness",
      description: "Organic health products bundle",
      products: ["Organic Honey", "Green Tea", "Almonds"],
      originalPrice: 1200,
      bundlePrice: 900,
      discount: "25%",
      status: "approved"
    },
    {
      id: "BUN003",
      name: "Spice Collection",
      description: "Premium spice collection",
      products: ["Cardamom", "Cinnamon", "Black Pepper"],
      originalPrice: 800,
      bundlePrice: 600,
      discount: "25%",
      status: "rejected"
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
      status: "pending",
      submittedDate: "2024-01-15"
    },
    {
      id: "ISS002",
      user: "Priya Sharma",
      email: "priya@email.com", 
      subject: "Wrong product received",
      description: "Received different product than ordered",
      priority: "medium",
      status: "approved",
      submittedDate: "2024-01-14"
    },
    {
      id: "ISS003",
      user: "Amit Patel",
      email: "amit@email.com", 
      subject: "Payment issue",
      description: "Payment deducted but order not confirmed",
      priority: "high",
      status: "rejected",
      submittedDate: "2024-01-13"
    }
  ]);

  // Handlers for supplier approval
  const handleApproveSupplier = (supplierId) => {
    setPendingSuppliers(prev => {
      const supplier = prev.find(s => s.id === supplierId);
      if (!supplier) return prev;
      setAcceptedSuppliers(acc => [...acc, { ...supplier, status: "accepted", verificationStatus: "verified" }]);
      return prev.filter(s => s.id !== supplierId);
    });
  };

  const handleRejectSupplier = (supplierId) => {
    setPendingSuppliers(prev => {
      const supplier = prev.find(s => s.id === supplierId);
      if (!supplier) return prev;
      setRejectedSuppliers(rej => [...rej, { ...supplier, status: "rejected", verificationStatus: "rejected", verificationDetails: { ...supplier.verificationDetails, rejectedDate: new Date().toISOString().split('T')[0], rejectedBy: "Admin" } }]);
      return prev.filter(s => s.id !== supplierId);
    });
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

  // Function to get FSSAI verification link
  const getFssaiVerificationLink = (fssaiNumber) => {
    return `https://foscos.fssai.gov.in/verification/license?lic_no=${fssaiNumber}`;
  };

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {/* Summary Cards Component */}
      <SummaryCards pendingSuppliers={pendingSuppliers} issues={issues} />

      {/* Tab Navigation Component */}
      <div className="px-8">
        <div className="bg-white rounded-t-lg shadow">
          <div className="flex border-b">
            {["Pending", "Accepted", "Rejected", "Bundles", "Issues"].map((tabName) => (
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
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow mx-0 mb-8 p-6 mt-0">
        {tab === "Pending" && (
          <SupplierManagement
            pendingSuppliers={pendingSuppliers}
            handleRejectSupplier={handleRejectSupplier}
            handleApproveSupplier={handleApproveSupplier}
          />
        )}
        {tab === "Accepted" && (
          <SupplierManagement
            pendingSuppliers={acceptedSuppliers}
            handleRejectSupplier={() => {}}
            handleApproveSupplier={() => {}}
          />
        )}
        {tab === "Rejected" && (
          <SupplierManagement
            pendingSuppliers={rejectedSuppliers}
            handleRejectSupplier={() => {}}
            handleApproveSupplier={() => {}}
          />
        )}
        {tab === "Bundles" && (
          <BundleManagement
            bundles={bundles}
            handleUpdateIssueStatus={() => {}}
          />
        )}
        {tab === "Issues" && (
          <IssueManagement
            issues={issues}
            handleUpdateIssueStatus={() => {}}
          />
        )}
      </div>

      {/* Verification Modal Component */}
      <VerificationModal
        showVerificationModal={showVerificationModal}
        selectedSupplier={selectedSupplier}
        setShowVerificationModal={setShowVerificationModal}
        handleApproveVerification={handleApproveVerification}
        handleRejectVerification={handleRejectVerification}
        handleDownloadFile={handleDownloadFile}
        getFssaiVerificationLink={getFssaiVerificationLink}
      />
    </div>
  );
};

export default Admin; 