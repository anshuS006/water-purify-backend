// controllers/technician.controller.js
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

exports.createTechnician = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if the technician already exists
    const existingTechnician = await User.findOne({ email });
    if (existingTechnician) {
      return next(new ApiError(400, "Technician already exists"));
    }

    // Create a new technician with the role 'technician'
    const technician = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: "technician",
    });

    res.status(201).json(
      new ApiResponse(201, {
        user: {
          id: technician._id,
          name: technician.name,
          email: technician.email,
          role: technician.role,
        },
        message: "Technician registered successfully",
      })
    );
  } catch (error) {
    next(new ApiError(500, "Server Error"));
  }
};
