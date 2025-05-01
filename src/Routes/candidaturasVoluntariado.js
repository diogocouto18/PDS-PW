const express = require("express");
const router = express.Router();
const candidaturaController = require("../Controllers/candidaturaVoluntariadoController");

const {autenticacao, apenasUtilizadores, apenasAdministrador, proprioUtilizadorOuAdministrador} = require("../Middlewares/authMiddlewares");

// Criar candidatura (apenas utilizadores)
router.post("/",autenticacao, apenasUtilizadores, candidaturaController.criarCandidatura);

// Avaliar candidatura (apenas administrador)
router.put("/:id/avaliar", autenticacao, apenasAdministrador, candidaturaController.avaliarCandidatura);

// Listar candidaturas de um anuncio (próprio utilizador ou administradores)
router.get("/anuncio/:id_anuncio", autenticacao, proprioUtilizadorOuAdministrador, candidaturaController.listarPorAnuncio);

module.exports = router;