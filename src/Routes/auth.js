const express = require("express");
const router = express.Router();
const authController = require("../Controllers/AuthController");

router.post("/register-utilizador", authController.registerUtilizador);
router.post("/register-administrador", authController.registerAdministrador);
router.post("/login-utilizador", authController.loginUtilizador);
router.post("/login-administrador", authController.loginAdministrador);

module.exports = router;
