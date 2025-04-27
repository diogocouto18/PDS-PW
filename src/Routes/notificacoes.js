const express = require("express");
const router = express.Router();
const notificacaoController = require("../Controllers/notificacaoController");

const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Criar notificação (provavelmente apenas Admins vão usar)
router.post("/", autenticacao, apenasAdministrador, notificacaoController.criarNotificacao);

// Listar notificações para utilizador
router.get("/utilizador/:id_utilizador", autenticacao, notificacaoController.listarNotificacoesPorUtilizador);

// Listar notificações para administrador
router.get("/administrador/:id_administrador", autenticacao, apenasAdministrador, notificacaoController.listarNotificacoesPorAdministrador);

// Marcar uma notificação como aberta
router.put("/:id/abrir", autenticacao, notificacaoController.abrirNotificacao);

// Apagar uma notificação
router.delete("/:id", autenticacao, apenasAdministrador, notificacaoController.apagarNotificacao);

module.exports = router;
