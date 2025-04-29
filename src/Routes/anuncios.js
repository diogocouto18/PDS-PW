const express = require("express");
const router = express.Router();
const anuncioController = require("../Controllers/anuncioController");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

// Criar um novo anúncio para um evento (apenas administrador)
router.post("/", autenticacao, apenasAdministrador, anuncioController.criarAnuncio);

// Listar todos os anúncios de um evento (qualquer utilizador)
router.get("/", autenticacao, anuncioController.listarAnuncios);

// Obtem um anuncio por ID (qualquer utilizador)
router.get("/:id", autenticacao, anuncioController.obterAnuncioPorId);

// Terminar um anuncio (apenas administrador)
router.put("/:id/encerrar", autenticacao, apenasAdministrador, anuncioController.encerrarAnuncio);

module.exports = router;
