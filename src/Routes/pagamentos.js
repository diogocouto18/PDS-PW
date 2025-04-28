const express = require("express");
const router = express.Router();
const pagamento = require("../Controllers/pagamentoController");

const { autenticacao } = require("../Middlewares/authMiddlewares");

// POST /pagamentos  → realiza compra de N rifas
router.post("/", autenticacao, pagamento.comprarRifas);

module.exports = router;
