const express = require("express");
const router = express.Router();
const anuncioController = require("../controllers/anuncioController");

// Criar um novo anúncio para um evento
router.post("/", anuncioController.criarAnuncio);

// Listar anúncios (por evento, se quiser)
router.get("/", anuncioController.listarAnuncios);

// Obter anúncio específico
router.get("/:id", anuncioController.obterAnuncioPorId);

module.exports = router;
