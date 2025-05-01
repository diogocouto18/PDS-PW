const express = require("express");
const router = express.Router();
const notificacaoController = require("../Controllers/notificacaoController");

const { autenticacao, apenasProprioUtilizador, apenasAdministrador, proprioUtilizadorOuAdministrador } = require("../Middlewares/authMiddlewares");

// Criar notificação (apenas administrador)
router.post("/", autenticacao, apenasAdministrador, notificacaoController.criarNotificacao);

// Listar notificações para um utilizador (próprio utilizador)
router.get("/utilizador/:id_utilizador", autenticacao, apenasProprioUtilizador, notificacaoController.listarNotificacoesPorUtilizador);

// Listar notificações para um administrador (apenas administrador)
router.get("/administrador/:id_administrador", autenticacao, apenasAdministrador, notificacaoController.listarNotificacoesPorAdministrador);

// Atualizar o estado de uma notificação (qualquer utilizador)
router.put("/:id/abrir", autenticacao, proprioUtilizadorOuAdministrador, notificacaoController.abrirNotificacao);

// Remover uma notificação (próprio utilizador ou administrador)
router.delete("/:id", autenticacao, proprioUtilizadorOuAdministrador, notificacaoController.apagarNotificacao);

module.exports = router;
