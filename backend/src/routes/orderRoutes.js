const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// POST /orders - Place new order
router.post("/place-order", orderController.createOrder);
router.get("/vendor/:vendorId", orderController.getOrdersByVendor);
router.get("/supplier/:supplierId", orderController.getOrdersBySupplier);
router.put("/:id/status", orderController.updateOrderStatus);

module.exports = router;
