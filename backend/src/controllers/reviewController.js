const Review = require("../models/review");

exports.createReview = async (req, res) => {
  try {
    const { vendorId, supplierId, rating, comment } = req.body;

    if (!vendorId || !supplierId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = new Review({
      vendorId,
      supplierId,
      rating,
      comment,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
