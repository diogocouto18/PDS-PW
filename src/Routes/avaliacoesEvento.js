const express = require("express");
const router = express.Router();
const avaliacaoController = require("../Controllers/avaliacaoEventoController");


const { autenticacao, apenasAdministrador, apenasUtilizadores, apenasProprioUtilizador} = require("../Middlewares/authMiddlewares");

// Submissão de avaliação (apenas utilizadores)
router.post("/", autenticacao, apenasUtilizadores, avaliacaoController.criarAvaliacao);

// Listar avaliações de um evento (apenas administradores)
router.get("/evento/:id_evento", autenticacao, avaliacaoController.listarPorEvento);

// Atualizar avaliação de um evento (próprio utilizador)
router.put("/:id", autenticacao, apenasProprioUtilizador, avaliacaoController.atualizarAvaliacao);

// Remover uma avaliação (próprio utilizador)
router.delete("/:id", autenticacao, apenasProprioUtilizador, avaliacaoController.eliminarAvaliacao);

// Média de avaliações de um evento
router.get("/evento/:id_evento/media", autenticacao, avaliacaoController.mediaDoEvento);

module.exports = router;