const express = require("express");
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/prod", productRoutes);
router.use('/users', userRoutes);

module.exports = router;
