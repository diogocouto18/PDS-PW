const express = require("express");
const router = express.Router();
const notificacaoController = require("../Controllers/notificacaoController");

const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Criar notificação (apenas administrador)
router.post("/", autenticacao, apenasAdministrador, notificacaoController.criarNotificacao);

// Listar notificações para um utilizador (qualquer utilizador)
router.get("/utilizador/:id_utilizador", autenticacao, notificacaoController.listarNotificacoesPorUtilizador);

// Listar notificações para um administrador (apenas administrador)
router.get("/administrador/:id_administrador", autenticacao, apenasAdministrador, notificacaoController.listarNotificacoesPorAdministrador);

// Atualizar o estado de uma notificação (qualquer utilizador)
router.put("/:id/abrir", autenticacao, notificacaoController.abrirNotificacao);

// Remover uma notificação (apenas administrador)
router.delete("/:id", autenticacao, apenasAdministrador, notificacaoController.apagarNotificacao);

module.exports = router;
