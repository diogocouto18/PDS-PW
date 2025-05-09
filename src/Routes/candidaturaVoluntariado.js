const express = require("express");
const router = express.Router();
const candidaturaController = require("../Controllers/candidaturaVoluntariadoController");

const {autenticacao, apenasUtilizadores, apenasAdministrador, apenasProprioUtilizador, proprioUtilizadorOuAdministrador} = require("../Middlewares/authMiddlewares");

// Criar candidatura (apenas utilizadores)
router.post("/",autenticacao, apenasUtilizadores, candidaturaController.criarCandidatura);

// Avaliar candidatura (apenas administrador)
router.put("/:id/avaliar", autenticacao, apenasAdministrador, candidaturaController.avaliarCandidatura);

// Listar candidaturas de um anuncio (apenas administradores)
router.get("/anuncio/:id_anuncio", autenticacao, apenasAdministrador, candidaturaController.listarPorAnuncio);

// Listar as candidaturas do próprio utilizador
router.get('/minhas', autenticacao, candidaturaController.listarMinhas);

// Remover uma candidatura existente (próprio utilizador)
router.delete("/candidaturas/:id", autenticacao, candidaturaController.eliminarCandidatura);

module.exports = router;