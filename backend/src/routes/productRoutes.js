const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Assume auth middleware exists and sets req.user
router.post("/add-product", addProduct); // Supplier adds product
router.get("/get-product", getAllProducts); // Anyone can view
router.put("/:id", updateProduct); // Supplier updates
router.delete("/:id", deleteProduct); // Supplier deletes (soft)

module.exports = router;
