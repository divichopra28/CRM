require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");

const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Redirect root to login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error ❌", err));

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
 
 