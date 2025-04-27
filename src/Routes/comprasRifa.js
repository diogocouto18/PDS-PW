const express = require("express");
const router = express.Router();
const compraRifaController = require("../Controllers/compraRifaController");
const { autenticacao } = require("../Middlewares/authMiddlewares");

// Apenas utilizadores autenticados podem comprar rifas
router.post("/", autenticacao, compraRifaController.criarCompra);

// Só para ver todas as compras (opcional - pode ser protegido também)
router.get("/", autenticacao, compraRifaController.listarCompras);

module.exports = router;