const express = require("express");
const router = express.Router();
const rifa = require("../Controllers/rifaController");

const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");


// GET    /rifas/sorteio/:id_sorteio    → lista todas as rifas daquele sorteio
router.get("/sorteio/:id_sorteio", autenticacao, rifa.listarRifasPorSorteio);

// GET    /rifas/:id                    → detalhes de uma rifa
router.get("/:id", autenticacao, rifa.obterRifaPorId);

// PUT    /rifas/:id/estado             → atualiza estado via body { estado }
router.put("/:id/estado", autenticacao, apenasAdministrador, rifa.atualizarEstadoRifa);

module.exports = router;
