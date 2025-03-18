require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./utils/logger"); 
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const serviceRoutes = require("./routes/service.routes");
const technicianRoutes = require("./routes/technician.routes"); // Import technician routes

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); 
app.use(cors()); 
app.use(helmet()); 
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } })); 

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/customer", serviceRoutes);
app.use("/api/technicians", technicianRoutes); // Use technician routes

// Basic route
app.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  res.json({ message: "Welcome to Water Purify Service API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server//
app.listen(process.env.PORT, () => {
  logger.info(`✅ Server running on port ${process.env.PORT}`);
});
