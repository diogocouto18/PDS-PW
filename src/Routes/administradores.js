const express = require("express");
const router = express.Router();
const administradorController = require("../Controllers/administradorController");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");


// Lista todos os administradores existentes (apenas administrador)
router.get("/", autenticacao, apenasAdministrador, administradorController.listarAdministradores);

// Obtem um administrador existente por um ID (apenas administrador)
router.get("/:id", autenticacao, apenasAdministrador, administradorController.obterPorId);

// Atualiza um administrador existente (apenas administrador)
router.put("/:id", autenticacao, apenasAdministrador, administradorController.atualizarAdministradores);

// Remove um administrador existente (apenas administrador)
router.delete("/:id", autenticacao, apenasAdministrador, administradorController.eliminarAdministradores);

module.exports = router;
