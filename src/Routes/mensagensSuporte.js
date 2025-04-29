const express = require("express");
const router = express.Router();
const mensagemSuporteController = require("../Controllers/mensagemSuporteController");

const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Abre o ticket/cria a primeira mensagem (qualquer utilizador)
router.post("/", autenticacao, mensagemSuporteController.criarMensagemInicial);

// Responder a um ticket (qualquer utilizador)
router.post("/:id_ticket/responder", autenticacao, mensagemSuporteController.enviarResposta);

// Fechar ticket (apenas administrador)
router.put("/:id_ticket/fechar", autenticacao, apenasAdministrador, mensagemSuporteController.fecharTicket);

// Listar mensagens de um ticket (qualquer utilizador)
router.get("/:id_ticket", autenticacao, mensagemSuporteController.listarMensagensDoTicket);



module.exports = router;
