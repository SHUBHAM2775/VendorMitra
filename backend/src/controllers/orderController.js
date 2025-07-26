const Order = require("../models/order");

exports.createOrder = async (req, res) => {
  try {
    const { vendorId, supplierId, items, deliveryType } = req.body;

    if (
      !vendorId ||
      !supplierId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !deliveryType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const totalPrice = items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );

    const newOrder = new Order({
      vendorId,
      supplierId,
      items,
      totalPrice,
      deliveryType,
      status: "pending",
      orderedAt: new Date(),
      updatedAt: new Date(),
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getOrdersByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const orders = await Order.find({ vendorId });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders by Vendor Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getOrdersBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;

    if (!supplierId) {
      return res.status(400).json({ message: "Supplier ID is required" });
    }

    const orders = await Order.find({ supplierId });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders by Supplier Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "accepted",
      "rejected",
      "dispatched",
      "delivered",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTotalOrderCount = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.status(200).json({ totalOrders: count });
  } catch (error) {
    console.error("Error getting total order count:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPendingOrderCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: "pending" });
    res.status(200).json({ pendingOrders: count });
  } catch (error) {
    console.error("Error getting pending order count:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
