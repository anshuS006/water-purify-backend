const winston = require("winston");
const path = require("path");

// Define log file paths
const logDirectory = path.resolve(__dirname, "../../logs");
const logFilePath = path.join(logDirectory, "app.log");

// Create a Winston logger instance
const logger = winston.createLogger({
  level: "info", // Logging level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Log as JSON for better structure
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Color output in console
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: logFilePath }), // Save logs to file
  ],
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection:", { reason, promise });
});

module.exports = logger;
