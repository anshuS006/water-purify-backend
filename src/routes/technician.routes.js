// routes/technician.routes.js
const express = require("express");
const { createTechnician } = require("../controllers/technician.controller");
const {restrictTo,protect} = require("../middlewares/auth.middleware");

const router = express.Router();

// POST route to create a technician, only accessible by admins
router.post("/create-technician", protect, restrictTo("admin"), createTechnician);

module.exports = router;
