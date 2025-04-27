const express = require("express");
const router = express.Router();
const mensagemSuporteController = require("../Controllers/mensagemSuporteController");

const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Criar primeiro ticket
router.post("/", autenticacao, mensagemSuporteController.criarMensagemInicial);

// Responder (user ou admin)
router.post("/:id_ticket/responder", autenticacao, mensagemSuporteController.enviarResposta);

// Listar mensagens de um ticket
router.get("/:id_ticket", autenticacao, mensagemSuporteController.listarMensagensDoTicket);

// Fechar ticket (apenas Admin)
router.put("/:id_ticket/fechar", autenticacao, apenasAdministrador, mensagemSuporteController.fecharTicket);

module.exports = router;
