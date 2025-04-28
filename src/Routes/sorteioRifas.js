const express = require("express");
const router = express.Router();
const sorteioRifas = require("../Controllers/sorteioRifasController");

const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");


// POST   /sorteios        → criar um novo sorteio
router.post("/", autenticacao, apenasAdministrador, sorteioRifas.criarSorteio);

// GET    /sorteios        → listar todos
router.get("/", autenticacao, sorteioRifas.listarSorteios);

// PUT    /sorteios/:id    → atualizar
router.put("/:id", autenticacao, apenasAdministrador, sorteioRifas.atualizarSorteio);

// DELETE /sorteios/:id    → remover
router.delete("/:id", autenticacao, apenasAdministrador, sorteioRifas.eliminarSorteio);

module.exports = router;
