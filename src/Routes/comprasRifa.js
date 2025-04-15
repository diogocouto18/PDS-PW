const express = require("express");
const router = express.Router();
const compraRifaController = require("../controllers/compraRifaController");

// Criar uma nova compra
router.post("/", compraRifaController.criarCompra);

// (Opcional) Confirmar pagamento
router.put("/:id/pagamento", compraRifaController.confirmarPagamento);

module.exports = router;
