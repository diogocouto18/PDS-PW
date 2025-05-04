const express = require("express");
const router = express.Router();
const eventoController = require("../Controllers/eventoController");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

// Criar um novo evento (apenas administrador)
router.post("/", autenticacao, apenasAdministrador, eventoController.criarEvento);

// Lista todos os eventos existentes (qualquer utilizador)
router.get("/", autenticacao, eventoController.listarEventos);

// Obtem detalhes de um evento (qualquer utilizador)
router.get("/:id", autenticacao, eventoController.obterEventoPorId);

// Atualiza um evento (apenas administrador)
router.put("/:id", autenticacao, apenasAdministrador, eventoController.atualizarEvento);

// Eliminar evento (só administradores)
router.delete("/eventos/:id", autenticacao, apenasAdministrador, eventoController.eliminarEvento);

module.exports = router;
