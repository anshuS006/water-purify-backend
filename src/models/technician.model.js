const mongoose = require("mongoose");

// Reference the User model so each technician is a User as well
const technicianSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Link to the User model
      required: true,
    },
    specialization: {
      type: String,
      enum: ["water-filter-installation", "repair", "maintenance", "other"],
      required: true,
    },
    available: {
      type: Boolean,
      default: true, // Whether the technician is available for new service requests
    },
    serviceRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    }],
  },
  { timestamps: true }
);

// Create and export the Technician model
const Technician = mongoose.model("Technician", technicianSchema);

module.exports = Technician;
