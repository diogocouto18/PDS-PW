const express = require("express");
const router = express.Router();
const pagamentoController = require("../Controllers/pagamentoController");

const { autenticacao, apenasUtilizadores } = require("../Middlewares/authMiddlewares");

// Executa compra de um nº de rifas (apenas utilizadores)
router.post("/", autenticacao, apenasUtilizadores, pagamentoController.comprarRifas);

module.exports = router;
