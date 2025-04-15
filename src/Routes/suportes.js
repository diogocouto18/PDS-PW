const express = require("express");
const router = express.Router();
const suporteController = require("../controllers/suporteController");
const mensagemSuporteController = require("../controllers/mensagemSuporteController");

// Endpoint para criar um novo ticket (Suporte)
router.post("/", suporteController.criarTicket);

// Endpoint para obter um ticket com suas mensagens
router.get("/:id", suporteController.obterTicketPorId);

// Endpoint para marcar o ticket como resolvido (se necessário)
router.put("/:id/resolver", suporteController.resolverTicket);

// Endpoint para enviar mensagem para um ticket
router.post("/:id/mensagens", mensagemSuporteController.enviarMensagem);

module.exports = router;
