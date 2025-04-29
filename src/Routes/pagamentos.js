const express = require("express");
const router = express.Router();
const pagamentoController = require("../Controllers/pagamentoController");

const { autenticacao } = require("../Middlewares/authMiddlewares");

// Executa compra de um nº de rifas (qualquer utilizador)
router.post("/", autenticacao, pagamentoController.comprarRifas);

module.exports = router;
