const express = require("express");
const router = express.Router();
const {
  verifySupplier,
  getPendingVerifications,
  getPendingVerificationCount,
  getRejectedVerificationCount,
} = require("../controllers/adminController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

router.get(
  "/pending-verifications",
  authMiddleware,
  isAdmin,
  getPendingVerifications
);
router.get(
  "/verification-pending-count",
  authMiddleware,
  isAdmin,
  getPendingVerificationCount
);
router.get("/verification-rejected-count", getRejectedVerificationCount);
router.put("/verify-supplier/:id", authMiddleware, isAdmin, verifySupplier);

module.exports = router;
