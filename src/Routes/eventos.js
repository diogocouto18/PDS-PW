const express = require("express");
const router = express.Router();
const eventoController = require("../Controllers/eventoController");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

// Criar um novo evento
router.post("/", autenticacao, apenasAdministrador, eventoController.criarEvento);

// (Opcional) Listar todos os eventos
router.get("/", autenticacao, eventoController.listarEventos);

// (Opcional) Obter detalhes de um evento
router.get("/:id", autenticacao, eventoController.obterEventoPorId);

// (Opcional) Atualizar/terminar um evento
router.put("/:id", autenticacao, apenasAdministrador, eventoController.atualizarEvento);


module.exports = router;
