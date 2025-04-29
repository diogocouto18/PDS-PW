const express = require("express");
const router = express.Router();
const authController = require("../Controllers/AuthController");


//Registo de um utilizador
router.post("/register-utilizador", authController.registerUtilizador);

//Registo de um administrador
router.post("/register-administrador", authController.registerAdministrador);

//Login de um utilizador
router.post("/login-utilizador", authController.loginUtilizador);

//Login de um administrador
router.post("/login-administrador", authController.loginAdministrador);

module.exports = router;
