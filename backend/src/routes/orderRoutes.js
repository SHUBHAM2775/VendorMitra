const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// /orders - Place new order
router.post("/place-order", orderController.createOrder);
router.get("/vendor/:vendorId", orderController.getOrdersByVendor);
router.get("/supplier/:supplierId", orderController.getOrdersBySupplier);
router.put("/:id/status", orderController.updateOrderStatus);
router.get("/total-orders", orderController.getTotalOrderCount);

module.exports = router;
