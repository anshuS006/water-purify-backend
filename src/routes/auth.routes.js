const express = require("express");
const { register, registerAdmin, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);

module.exports = router;
