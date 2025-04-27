const express = require("express");
const router = express.Router();
const mensagemSuporteController = require("../Controllers/mensagemSuporteController");

const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Criar primeiro ticket
router.post("/", autenticacao, mensagemSuporteController.criarMensagemInicial);

// Responder (user ou admin)
router.post("/:ticket_id/responder", autenticacao, mensagemSuporteController.enviarResposta);

// Listar mensagens de um ticket
router.get("/:ticket_id", autenticacao, mensagemSuporteController.listarMensagensDoTicket);

// Fechar ticket (apenas Admin)
router.put("/:ticket_id/fechar", autenticacao, apenasAdministrador, mensagemSuporteController.fecharTicket);

module.exports = router;
