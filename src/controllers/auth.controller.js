const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const ApiResponse = require('../utils/apiResponse'); // Import the ApiResponse class
const ApiError = require('../utils/apiError'); // Custom error handler

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: "7d" });
};

// @desc Register User (Customer or Service Provider)
// @route POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["customer", "service_provider"].includes(role)) {
      return next(new ApiError(400, "Invalid role"));
    }

    let user = await User.findOne({ email });
    if (user) {
      return next(new ApiError(400, "User already exists"));
    }

    user = await User.create({ name, email, password, role });

    res.status(201).json(
      new ApiResponse(201, {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id, user.role),
      }, "User registered successfully")
    );
  } catch (error) {
    next(new ApiError(500, "Server Error"));
  }
};

// @desc Register Admin (Allowed only by existing admins)
// @route POST /api/auth/register-admin
exports.registerAdmin = async (req, res, next) => {
  try {
    // Ensure only an admin can create another admin
    if (!req.user || req.user.role !== "admin") {
      return next(new ApiError(403, "Only admins can create new admins"));
    }

    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return next(new ApiError(400, "Admin already exists"));

    user = await User.create({ name, email, password, role: "admin" });

    res.status(201).json(
      new ApiResponse(201, {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id, user.role),
      }, "Admin registered successfully")
    );
  } catch (error) {
    next(new ApiError(500, "Server Error"));
  }
};

// @desc Login User (Customer, Service Provider, Admin)
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new ApiError(401, "Invalid credentials"));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new ApiError(401, "Invalid credentials"));

    res.json(
      new ApiResponse(200, {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id, user.role),
      }, "Login successful")
    );
  } catch (error) {
    next(new ApiError(500, "Server Error"));
  }
};
