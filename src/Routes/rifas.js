const express = require("express");
const router = express.Router();
const rifaController = require("../Controllers/rifaController");

const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");


// Lista todas as rifas de um sorteio específico (apenas administrador)
router.get("/sorteio/:id_sorteio", autenticacao, apenasAdministrador, rifaController.listarRifasPorSorteio);

// Lista todas as rifas de um utilizador ()
router.get('/minhas', autenticacao, rifaController.listarRifasUtilizador);

// Detalhes de uma rifa (apenas administrador)
router.get("/:id", autenticacao, apenasAdministrador, rifaController.obterRifaPorId);

// Atualiza estado de uma rifa (apenas administrador)
router.put("/:id/estado", autenticacao, apenasAdministrador, rifaController.atualizarEstadoRifa);

module.exports = router;
