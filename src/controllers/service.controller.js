const Service = require("../models/service.model");
const Technician = require("../models/technician.model");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const logger = require("../utils/logger");

// Create a new service request
exports.createServiceRequest = async (req, res) => {
  try {
    const { customerId, serviceType, description, appointmentDate } = req.body;

    if (!customerId || !serviceType || !description || !appointmentDate) {
      throw new ApiError(400, "All fields are required");
    }

    const serviceRequest = new Service({
        customerId,
      serviceType,
      description,
      appointmentDate,
    });

    await serviceRequest.save();
    logger.info(`Service request created: ${serviceRequest._id}`);

    const response = new ApiResponse(201, serviceRequest, "Service request created successfully");
    res.status(response.statusCode).json(response);
  } catch (error) {
    logger.error(`Error creating service request: ${error.message}`);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      const response = new ApiResponse(500, null, "Internal Server Error");
      res.status(response.statusCode).json(response);
    }
  }
};

// Get all service requests
exports.getAllServiceRequests = async (req, res) => {
  try {
    const services = await Service.find().populate("customer technician");
    const response = new ApiResponse(200, services, "Fetched all service requests successfully");
    res.status(response.statusCode).json(response);
  } catch (error) {
    logger.error(`Error fetching service requests: ${error.message}`);
    const response = new ApiResponse(500, null, "Internal Server Error");
    res.status(response.statusCode).json(response);
  }
};

// Get all pending service requests for service provider
exports.getPendingServiceRequests = async (req, res) => {
    try {
      // Only get service requests with 'pending' status
      const pendingRequests = await Service.find({ status: "pending" })
        .populate("customerId")
        .populate("technician"); // This will show the technician if assigned
  console.log(pendingRequests)
      res.status(200).json({
        statusCode: 200,
        message: "Fetched pending service requests successfully",
        data: pendingRequests
      });
    } catch (error) {
      logger.error(`Error fetching pending service requests: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
// Service provider assigns technician to service request
exports.assignTechnicianToServiceRequest = async (req, res) => {
    try {
      const { technicianId } = req.body;
      const serviceRequest = await Service.findById(req.params.id);
  
      if (!serviceRequest) {
        return res.status(404).json({ error: "Service request not found" });
      }
  
      const technician = await Technician.findById(technicianId);
      if (!technician) {
        return res.status(404).json({ error: "Technician not found" });
      }
  
      // Assign the technician to the service request
      serviceRequest.technician = technician._id;
      serviceRequest.status = "in-progress"; // Change status to in-progress when technician is assigned
  
      await serviceRequest.save();
  
      res.status(200).json({
        statusCode: 200,
        message: "Technician assigned successfully",
        data: serviceRequest
      });
    } catch (error) {
      logger.error(`Error assigning technician: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };  

// Get a single service request by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("customer technician");
    if (!service) {
      throw new ApiError(404, "Service request not found");
    }

    const response = new ApiResponse(200, service, "Service request fetched successfully");
    res.status(response.statusCode).json(response);
  } catch (error) {
    logger.error(`Error fetching service request: ${error.message}`);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      const response = new ApiResponse(500, null, "Internal Server Error");
      res.status(response.statusCode).json(response);
    }
  }
};

// Update service request status
exports.updateServiceStatus = async (req, res) => {
  try {
    const { status, technician } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      throw new ApiError(404, "Service request not found");
    }

    service.status = status || service.status;
    service.technician = technician || service.technician;

    await service.save();
    logger.info(`Service status updated: ${service._id} - ${service.status}`);

    const response = new ApiResponse(200, service, "Service status updated successfully");
    res.status(response.statusCode).json(response);
  } catch (error) {
    logger.error(`Error updating service status: ${error.message}`);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      const response = new ApiResponse(500, null, "Internal Server Error");
      res.status(response.statusCode).json(response);
    }
  }
};

// Delete a service request
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      throw new ApiError(404, "Service request not found");
    }
    logger.info(`Service request deleted: ${service._id}`);

    const response = new ApiResponse(200, null, "Service request deleted successfully");
    res.status(response.statusCode).json(response);
  } catch (error) {
    logger.error(`Error deleting service request: ${error.message}`);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      const response = new ApiResponse(500, null, "Internal Server Error");
      res.status(response.statusCode).json(response);
    }
  }
};

// Update service request with a technician
exports.assignTechnicianToService = async (req, res) => {
    try {
      const { technicianId, serviceId } = req.body;
      const technician = await Technician.findById(technicianId);
      const service = await Service.findById(serviceId);
  
      if (!technician || !service) {
        return res.status(404).json({ error: "Technician or Service not found" });
      }
  
      service.technician = technicianId;
      service.status = "in-progress";  // Update service status
  
      await service.save();
  
      logger.info(`Service request ${serviceId} assigned to technician ${technicianId}`);
      res.status(200).json(service);
    } catch (error) {
      logger.error(`Error assigning technician: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
