const express = require("express");
const cors = require("cors");

const app = express();

// Configure CORS properly for production
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173", // Vite dev server
    "https://vendor-mitra-five.vercel.app/", // Your Vercel domain
    process.env.FRONTEND_URL // Add your specific Vercel URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));


const routes = require("./routes"); // Assuming this is your index router file
app.use("/api", routes);

module.exports = app;
