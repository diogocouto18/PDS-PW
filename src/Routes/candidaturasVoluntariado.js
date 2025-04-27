const express = require("express");
const router = express.Router();
const candidaturaController = require("../controllers/candidaturaVoluntariadoController");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

// Criar candidatura
router.post("/",autenticacao, candidaturaController.criarCandidatura);

// Avaliar candidatura (Aceite ou Rejeitado)
router.put("/:id/avaliar", autenticacao, apenasAdministrador, candidaturaController.avaliarCandidatura);

// Listar candidaturas (opcional, ex.: do admin para avaliar)
router.get("/anuncio/:id_anuncio", autenticacao, candidaturaController.listarPorAnuncio);

module.exports = router;
