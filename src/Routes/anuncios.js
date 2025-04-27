const express = require("express");
const router = express.Router();
const anuncioController = require("../controllers/anuncioController");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

// Criar um novo anúncio para um evento
router.post("/", autenticacao, apenasAdministrador, anuncioController.criarAnuncio);

// Listar anúncios (por evento, se quiser)
router.get("/", autenticacao, anuncioController.listarAnuncios);

// Obter anúncio específico
router.get("/:id", autenticacao, anuncioController.obterAnuncioPorId);
/*
// Encerrar anúncio (apenas Administrador)
router.put("/:id/encerrar", autenticacao, apenasAdministrador, anuncioController.encerrarAnuncio);
*/
module.exports = router;
