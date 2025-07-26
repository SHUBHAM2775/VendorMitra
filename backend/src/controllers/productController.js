const Product = require("../models/product");

// POST /products
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      supplierId: req.user.id, // from auth middleware
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate(
      "supplierId",
      "name"
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// PUT /products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, supplierId: req.user.id },
      req.body,
      { new: true }
    );
    if (!product)
      return res
        .status(404)
        .json({ error: "Product not found or unauthorized" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, supplierId: req.user.id },
      { isActive: false },
      { new: true }
    );
    if (!product)
      return res
        .status(404)
        .json({ error: "Product not found or unauthorized" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductsBySupplierId = async (req, res) => {
  try {
    const { supplierId } = req.params;

    if (!supplierId) {
      return res.status(400).json({ message: "Supplier ID is required" });
    }

    const products = await Product.find({ supplierId });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by supplier ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
