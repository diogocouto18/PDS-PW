const express = require("express");
const router = express.Router();
const utilizadorController = require("../Controllers/utilizadorController.js");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

//router.post("/", utilizadorController.criarUtilizador);

// Lista todos os utilizadores (apenas administrador)
router.get("/", autenticacao, apenasAdministrador, utilizadorController.listarUtilizadores);

// Obtem um utilizador pelo o ID (apenas administrador)
router.get("/:id", autenticacao, apenasAdministrador, utilizadorController.obterPorId);

// Atualiza um utilizador (apenas administrador)
router.put("/:id", autenticacao, apenasAdministrador, utilizadorController.atualizarUtilizadores);

// Remove um utilizador (apenas administrador)
router.delete("/:id", autenticacao, apenasAdministrador, utilizadorController.eliminarUtilizadores);

module.exports = router;
