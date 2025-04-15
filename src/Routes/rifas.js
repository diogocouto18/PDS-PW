const express = require("express");
const router = express.Router();
const rifaController = require("../controllers/rifaController");

// Criar Rifa
router.post("/", rifaController.criarRifa);

// Listar Rifas (por evento, se quiser)
router.get("/", rifaController.listarRifas);

// Obter detalhes de uma Rifa
router.get("/:id", rifaController.obterRifa);

// Encerrar/Sortear uma Rifa
router.post("/:id/sortear", rifaController.sortearRifa);

module.exports = router;
