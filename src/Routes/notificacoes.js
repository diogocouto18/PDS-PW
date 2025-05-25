const express = require("express");
const router = express.Router();
const notificacaoController = require("../Controllers/notificacaoController");

const { autenticacao, apenasProprioUtilizador, apenasAdministrador, proprioUtilizadorOuAdministrador } = require("../Middlewares/authMiddlewares");

// Criar notificação (apenas administrador)
router.post("/", autenticacao, notificacaoController.criarNotificacao);

// Listar notificações para um utilizador (próprio utilizador)
router.get("/utilizador/:id_utilizador", autenticacao, apenasProprioUtilizador, notificacaoController.listarNotificacoesPorUtilizador);

// Listar notificações para um administrador (apenas administrador)
router.get("/administrador/:id_administrador", autenticacao, apenasAdministrador, notificacaoController.listarNotificacoesPorAdministrador);

// Atualizar o estado de uma notificação (qualquer utilizador)
router.put("/:id/abrir", autenticacao, notificacaoController.abrirNotificacao);

// Remover uma notificação (próprio utilizador ou administrador)
router.delete("/:id", autenticacao, notificacaoController.apagarNotificacao);

// Faz uma contagem das notificações do utilizador
router.get('/utilizador/:id_utilizador/por_abrir', autenticacao, notificacaoController.contarNotificacoesUtilizador);

// Faz uma contagem das notificações do administrador
router.get('/administrador/:id_administrador/por_abrir', autenticacao, notificacaoController.contarNotificacoesAdministrador);

module.exports = router;
