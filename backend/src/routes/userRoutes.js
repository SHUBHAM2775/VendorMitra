const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  uploadKycDocs,
  getVerifiedSuppliers,
  getVerificationStatusById,
} = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

// Route: GET /users/:id
router.get("/get-user/:id", authMiddleware, getUserProfile);

// Route: PUT /users/:id
router.put("/update-user/:id", authMiddleware, updateUserProfile);

router.post(
  "/:id/verify",
  authMiddleware,
  upload.array("kycDocs", 5),
  uploadKycDocs
);

router.get("/suppliers", authMiddleware, getVerifiedSuppliers);

// Route: GET /users/:id/verification-status
router.get(
  "/verification-status/:id",
  authMiddleware,
  getVerificationStatusById
);

module.exports = router;
