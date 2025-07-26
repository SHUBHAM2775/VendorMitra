const express = require("express");
const router = express.Router();
const { verifySupplier, getPendingVerifications } = require("../controllers/adminController");
const {authMiddleware, isAdmin} = require("../middleware/authMiddleware");

router.get("/pending-verifications", authMiddleware,isAdmin, getPendingVerifications);
router.put("/verify-supplier/:id", authMiddleware ,isAdmin, verifySupplier);

module.exports = router;
