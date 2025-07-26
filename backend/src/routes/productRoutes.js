const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../controllers/productController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Routes
router.post("/add-product", authMiddleware, addProduct);
router.get("/get-product", authMiddleware, getAllProducts);
router.get("/get-product/:id", authMiddleware, getProductById);
router.put("/update-product/:id", authMiddleware, updateProduct);
router.delete("/delete-product/:id", authMiddleware, deleteProduct);

module.exports = router;
