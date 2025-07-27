import React, { useState, useEffect } from "react";
import SummaryCards from "./admin/SummaryCards";
import {
  getPendingVerifications,
  getApprovedVerifications,
  getRejectedVerifications,
} from "../services/adminServices";
import SupplierManagement from "./admin/SupplierManagement";
import BundleManagement from "./admin/BundleManagement";
import IssueManagement from "./admin/IssueManagement";
import VerificationModal from "./admin/VerificationModal";

const Admin = () => {
  const [tab, setTab] = useState("Pending");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [pendingSuppliers, setPendingSuppliers] = useState([]);
  const [acceptedSuppliers, setAcceptedSuppliers] = useState([]);
  const [rejectedSuppliers, setRejectedSuppliers] = useState([]);

  const formatSuppliers = (suppliers) => {
    return suppliers.map((s) => ({
      id: s._id,
      name: s.name,
      fssaiLicenseNumber: s.kycDocs?.[0] || "N/A",
      submittedDate: new Date(s.createdAt).toISOString().split("T")[0],
      status: s.verificationStatus,
      verificationStatus: s.verificationStatus,
      verificationDetails: {
        businessName: s.name,
        fssaiNumber: s.kycDocs?.[0] || "",
        certificateType: "FSSAI",
        businessAddress: "N/A",
        contactPerson: s.name,
        phoneNumber: s.phone || "N/A",
        email: s.email,
        certificateFile: {
          name: s.kycDocs?.[0] || "Document",
          url: "#", // Replace with actual download URL if available
          type: "application/pdf",
        },
        submittedDate: new Date(s.createdAt).toISOString().split("T")[0],
        verifiedDate: s.updatedAt ? new Date(s.updatedAt).toISOString().split("T")[0] : null,
        verifiedBy: "Admin",
      },
    }));
  };

  // 🟢 Fetch All Supplier Verification States
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const [pending, approved, rejected] = await Promise.all([
          getPendingVerifications(),
          getApprovedVerifications(),
          getRejectedVerifications(),
        ]);

        setPendingSuppliers(formatSuppliers(pending));
        setAcceptedSuppliers(formatSuppliers(approved));
        setRejectedSuppliers(formatSuppliers(rejected));
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  // 🔵 Supplier Verification Handlers
  const handleApproveSupplier = (supplierId) => {
    setPendingSuppliers(prev => {
      const supplier = prev.find(s => s.id === supplierId);
      if (!supplier) return prev;
      setAcceptedSuppliers(acc => [...acc, { ...supplier, verificationStatus: "verified" }]);
      return prev.filter(s => s.id !== supplierId);
    });
  };

  const handleRejectSupplier = (supplierId) => {
    setPendingSuppliers(prev => {
      const supplier = prev.find(s => s.id === supplierId);
      if (!supplier) return prev;
      setRejectedSuppliers(rej => [...rej, { ...supplier, verificationStatus: "rejected" }]);
      return prev.filter(s => s.id !== supplierId);
    });
  };

  // 🟡 Modal Verification Handlers
  const handleVerifySupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setShowVerificationModal(true);
  };

  const handleApproveVerification = (supplierId) => {
    setPendingSuppliers(prev =>
      prev.map(supplier =>
        supplier.id === supplierId
          ? {
              ...supplier,
              verificationStatus: "verified",
              verificationDetails: {
                ...supplier.verificationDetails,
                verifiedDate: new Date().toISOString().split("T")[0],
                verifiedBy: "Admin",
              },
            }
          : supplier
      )
    );
    setShowVerificationModal(false);
  };

  const handleRejectVerification = (supplierId) => {
    setPendingSuppliers(prev =>
      prev.map(supplier =>
        supplier.id === supplierId
          ? {
              ...supplier,
              verificationStatus: "rejected",
              verificationDetails: {
                ...supplier.verificationDetails,
                rejectedDate: new Date().toISOString().split("T")[0],
                rejectedBy: "Admin",
              },
            }
          : supplier
      )
    );
    setShowVerificationModal(false);
  };

  // Utility
  const handleDownloadFile = (file) => {
    alert(`Downloading ${file.name}`);
  };

  const getFssaiVerificationLink = (fssaiNumber) => {
    return `https://foscos.fssai.gov.in/verification/license?lic_no=${fssaiNumber}`;
  };

  // 🟣 Bundle and Issue Handlers (demo logic)
  const [bundles, setBundles] = useState([]);
  const [issues, setIssues] = useState([]);
  const handleToggleBundle = () => {};
  const handleUpdateIssueStatus = () => {};

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <SummaryCards pendingSuppliers={pendingSuppliers} issues={issues} />

      <div className="px-8">
        <div className="bg-white rounded-t-lg shadow">
          <div className="flex border-b">
            {["Pending", "Accepted", "Rejected", "Bundles", "Issues"].map(tabName => (
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
          <BundleManagement bundles={bundles} handleUpdateIssueStatus={handleUpdateIssueStatus} />
        )}
        {tab === "Issues" && (
          <IssueManagement issues={issues} handleUpdateIssueStatus={handleUpdateIssueStatus} />
        )}
      </div>

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
