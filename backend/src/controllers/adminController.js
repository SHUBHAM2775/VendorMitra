const User = require("../models/user"); 

// GET /api/admin/pending-verifications
const getPendingVerifications = async (req, res) => {
  try {
    const pendingSuppliers = await User.find({
      role: "supplier",
      verificationStatus: "pending",
    }).select("-password"); // don’t send password back

    res.json({ suppliers: pendingSuppliers });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getRejectedVerifications = async (req, res) => {
  try {
    const rejectedSuppliers = await User.find({
      role: "supplier",
      verificationStatus: "rejected",
    }).select("-password");

    res.json({ suppliers: rejectedSuppliers });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getApprovedVerifications = async (req, res) => {
  try {
    const approvedSuppliers = await User.find({
      role: "supplier",
      verificationStatus: "verified",
    }).select("-password");

    res.json({ suppliers: approvedSuppliers });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// PUT /api/admin/verify-supplier/:id
const verifySupplier = async (req, res) => {
  try {
    console.log("verifySupplier", req.body);
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const supplier = await User.findById(req.params.id);
    if (!supplier || supplier.role !== "supplier") {
      return res.status(404).json({ message: "Supplier not found" });
    }

     if (status === "approved" && !supplier.fssaiNumber) {
      return res.status(400).json({ message: "FSSAI number is missing. Cannot approve." });
    }

    supplier.verificationStatus = status;
    supplier.isVerified = status === "approved";
    supplier.updatedAt = new Date();
    await supplier.save();

    res.json({ message: `Supplier ${status} successfully` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getPendingVerificationCount = async (req, res) => {
  try {
    const count = await User.countDocuments({
      role: "supplier",
      verificationStatus: "pending"
    });

    res.json({ count });
  } catch (error) {
    console.error("Error fetching pending verification count:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getRejectedVerificationCount = async (req, res) => {
  try {
    const count = await User.countDocuments({
      role: "supplier",
      verificationStatus: "rejected"
    });

    res.json({ count });
  } catch (error) {
    console.error("Error fetching rejected verification count:", error);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  getPendingVerifications,
  getRejectedVerifications,
  getApprovedVerifications,
  getPendingVerificationCount,
  getRejectedVerificationCount,
  verifySupplier,
};