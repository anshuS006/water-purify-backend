const express = require("express");
const router = express.Router();
const {
  createServiceRequest,
  getAllServiceRequests,
  getServiceById,
  updateServiceStatus,
  deleteService,
  getPendingServiceRequests,
  assignTechnicianToServiceRequest,
} = require("../controllers/service.controller");

const { protect, restrictTo } = require("../middlewares/auth.middleware");

// Routes
router.post("/request", protect, createServiceRequest);  // Only authenticated users can request a service
//router.get("/", protect, getAllServiceRequests);  // Only authenticated users can view services
//router.get("/:id", protect, getServiceById);  // Only authenticated users can view a specific service

// Only admins or service providers can update service status
//router.put("/:id/status", protect, restrictTo("admin", "service_provider"), updateServiceStatus);

// Only admins can delete a service
//router.delete("/:id", protect, restrictTo("admin"), deleteService);

// Route to fetch all pending service requests (for service providers)
router.get("/pending", protect, restrictTo("admin","service_provider"), getPendingServiceRequests);

// Route to assign technician to service request (for service providers)
router.put("/:id/assign", protect, restrictTo("service_provider"), assignTechnicianToServiceRequest);


module.exports = router;
