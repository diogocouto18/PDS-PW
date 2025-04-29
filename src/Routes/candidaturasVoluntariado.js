const express = require("express");
const router = express.Router();
const candidaturaController = require("../Controllers/candidaturaVoluntariadoController");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

// Criar candidatura (qualquer utilizador)
router.post("/",autenticacao, candidaturaController.criarCandidatura);

// Avaliar candidatura (apenas administrador)
router.put("/:id/avaliar", autenticacao, apenasAdministrador, candidaturaController.avaliarCandidatura);

// Listar candidaturas de um anuncio (qualquer utilizador)
router.get("/anuncio/:id_anuncio", autenticacao, candidaturaController.listarPorAnuncio);

module.exports = router;