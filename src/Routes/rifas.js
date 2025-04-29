const express = require("express");
const router = express.Router();
const rifaController = require("../Controllers/rifaController");

const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");


// Lista todas as rifas de um sorteio específico (qualquer utilizador)
router.get("/sorteio/:id_sorteio", autenticacao, rifaController.listarRifasPorSorteio);

// Detalhes de uma rifa (qualquer utilizador)
router.get("/:id", autenticacao, rifaController.obterRifaPorId);

// Atualiza estado de uma rifa (apenas administrador)
router.put("/:id/estado", autenticacao, apenasAdministrador, rifaController.atualizarEstadoRifa);

module.exports = router;
