const express = require("express");
const router = express.Router();
const avaliacaoController = require("../Controllers/avaliacaoEventoController");


const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Submissão de avaliação (qualquer utilizador)
router.post("/", autenticacao, avaliacaoController.criarAvaliacao);

// Listar avaliações de um evento (qualquer utilizador)
router.get("/evento/:id_evento", autenticacao, avaliacaoController.listarPorEvento);

// Atualizar avaliação de um evento (autor)
router.put("/:id", autenticacao, avaliacaoController.atualizarAvaliacao);

// Remover uma avaliação (apenas Administrador)
router.delete("/:id", autenticacao, apenasAdministrador, avaliacaoController.eliminarAvaliacao);

// Média de avaliações de um evento
router.get("/evento/:id_evento/media", autenticacao, avaliacaoController.mediaDoEvento);

module.exports = router;