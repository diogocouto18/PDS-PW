const express = require("express");
const router = express.Router();
const pagamentoController = require("../Controllers/pagamentoController");
const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Confirmar pagamento
router.put("/:id/confirmar", autenticacao, apenasAdministrador, pagamentoController.confirmar);

module.exports = router;