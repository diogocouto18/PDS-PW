const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");

// Criar um novo evento
router.post("/", eventoController.criarEvento);

// (Opcional) Listar todos os eventos
router.get("/", eventoController.listarEventos);

// (Opcional) Obter detalhes de um evento
router.get("/:id", eventoController.obterEventoPorId);

// (Opcional) Atualizar/terminar um evento
// router.put("/:id", eventoController.atualizarEvento);

module.exports = router;
