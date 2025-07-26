const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsBySupplierId,
} = require("../controllers/productController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Routes
router.post("/add-product", authMiddleware, addProduct);
router.get("/get-product", authMiddleware, getAllProducts);
router.get("/get-product/:id", authMiddleware, getProductById);
router.put("/update-product/:id", authMiddleware, updateProduct);
router.delete("/delete-product/:id", authMiddleware, deleteProduct);
router.get("/supplier/:supplierId", authMiddleware, getProductsBySupplierId);

module.exports = router;
