const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, uploadKYC, getVerifiedSuppliers } = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");
const upload = require('../utils/upload');

// Route: GET /users/:id
router.get('/get-user:id', authMiddleware, getUserProfile);

// Route: PUT /users/:id
router.put('/update-user:id', authMiddleware, updateUserProfile);

router.post('/upload-kyc:id/verify', upload.array('kycDocs', 5), authMiddleware, uploadKYC);

router.get('/suppliers', authMiddleware, getVerifiedSuppliers);

module.exports = router;
