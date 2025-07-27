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

    if (
      req.user &&
      req.user.role === "supplier" &&
      req.user.id !== supplierId
    ) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only view your own orders." });
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

    let query = { _id: orderId };
    if (req.user && req.user.role === "supplier") {
      query.supplierId = req.user.id;
    }

    const updatedOrder = await Order.findOneAndUpdate(
      query,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTotalOrderCount = async (req, res) => {
  try {
    let query = {};

    if (req.user && req.user.role === "supplier") {
      query.supplierId = req.user.id;
    }

    const count = await Order.countDocuments(query);
    res.status(200).json({ totalOrders: count });
  } catch (error) {
    console.error("Error getting total order count:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPendingOrderCount = async (req, res) => {
  try {
    let query = { status: "pending" };

    if (req.user && req.user.role === "supplier") {
      query.supplierId = req.user.id;
    }

    const count = await Order.countDocuments(query);
    res.status(200).json({ pendingOrders: count });
  } catch (error) {
    console.error("Error getting pending order count:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getDispatchedOrdersForSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;

    if (!supplierId) {
      return res.status(400).json({ message: "Supplier ID is required" });
    }

    if (
      req.user &&
      req.user.role === "supplier" &&
      req.user.id !== supplierId
    ) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only view your own orders." });
    }

    const orders = await Order.find({
      supplierId,
      status: "dispatched",
    }).sort({ orderedAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching dispatched orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPendingOrdersForSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;

    if (!supplierId) {
      return res.status(400).json({ message: "Supplier ID is required" });
    }

    if (
      req.user &&
      req.user.role === "supplier" &&
      req.user.id !== supplierId
    ) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only view your own orders." });
    }

    const orders = await Order.find({
      supplierId,
      status: "pending",
    }).sort({ orderedAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "supplier") {
      return res
        .status(403)
        .json({ message: "Access denied. Suppliers only." });
    }

    const orders = await Order.find({
      supplierId: req.user.id,
    }).sort({ orderedAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching supplier's orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMyOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!req.user || req.user.role !== "supplier") {
      return res
        .status(403)
        .json({ message: "Access denied. Suppliers only." });
    }

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

    const orders = await Order.find({
      supplierId: req.user.id,
      status: status,
    }).sort({ orderedAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching supplier's orders by status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
