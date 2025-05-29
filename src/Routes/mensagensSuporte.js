const express = require("express");
const router = express.Router();
const mensagemSuporteController = require("../Controllers/mensagemSuporteController");

const { autenticacao, proprioUtilizadorOuAdministrador, apenasUtilizadores, apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Abre o ticket/cria a primeira mensagem (apenas utilizadores)
router.post("/", autenticacao,  mensagemSuporteController.criarMensagemInicial);

// Responder a um ticket (próprio utilizador ou administrador)
router.post("/:id_ticket/responder", autenticacao,  mensagemSuporteController.enviarResposta);

// Fechar ticket (próprio utilizador)
router.put("/:id_ticket/fechar", autenticacao, mensagemSuporteController.fecharTicket);

// Listar mensagens de um ticket (próprio utilizador ou administrador)
router.get("/:id_ticket", autenticacao, mensagemSuporteController.listarMensagensDoTicket);

// Remover ticket existente (apenas administradores)
router.delete("/suporte/:id_ticket", autenticacao, mensagemSuporteController.eliminarTicket);

router.get("/aberto", autenticacao,  mensagemSuporteController.verificarTicket);

router.get("/", autenticacao, mensagemSuporteController.listarTickets);

router.get("/detalhes/utilizador", autenticacao, mensagemSuporteController.getTicketDetalhadoUtilizador);

module.exports = router;
