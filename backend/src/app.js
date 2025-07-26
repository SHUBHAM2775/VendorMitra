const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));


const routes = require("./routes"); // Assuming this is your index router file
app.use("/api", routes);

module.exports = app;
