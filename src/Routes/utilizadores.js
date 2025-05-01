const express = require("express");
const router = express.Router();
const utilizadorController = require("../Controllers/utilizadorController.js");

const {autenticacao, proprioUtilizadorOuAdministrador, apenasAdministrador} = require("../Middlewares/authMiddlewares");

// Lista todos os utilizadores (apenas administrador)
router.get("/", autenticacao, apenasAdministrador, utilizadorController.listarUtilizadores);

// Obtem um utilizador pelo o ID (apenas administrador)
router.get("/:id", autenticacao, apenasAdministrador, utilizadorController.obterPorId);

// Atualiza um utilizador (próprio utilizador ou administrador)
router.put("/:id", autenticacao, proprioUtilizadorOuAdministrador, utilizadorController.atualizarUtilizadores);

// Remove um utilizador (apenas administrador)
router.delete("/:id", autenticacao, apenasAdministrador, utilizadorController.eliminarUtilizadores);

module.exports = router;
