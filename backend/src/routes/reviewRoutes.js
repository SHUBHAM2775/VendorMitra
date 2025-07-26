const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// POST /reviews – submit review
router.post("/submit-review", reviewController.createReview);
router.get("/get-review/:supplierId", reviewController.getReviewsBySupplier);

module.exports = router;
