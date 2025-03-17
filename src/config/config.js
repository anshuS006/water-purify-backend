const dotenv = require("dotenv");
const path = require("path");

// Determine which .env file to load
const envFile = `.env.${process.env.NODE_ENV || "dev"}`;

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../env", envFile) });

module.exports = {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
};
