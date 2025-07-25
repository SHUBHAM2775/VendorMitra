const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

// Assume auth middleware exists and sets req.user
router.post("/add-product", authMiddleware, addProduct); // Supplier adds product
router.get("/get-product", authMiddleware, getAllProducts); // Anyone can view
router.put("/update-product:id", authMiddleware, updateProduct); // Supplier updates
router.delete("/delete-product:id", authMiddleware, deleteProduct); // Supplier deletes (soft)

module.exports = router;
