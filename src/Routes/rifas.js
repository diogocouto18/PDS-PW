const express = require("express");
const router = express.Router();
const rifaController = require("../Controllers/rifaController");
const { autenticacao } = require("../Middlewares/authMiddlewares");
const { apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Apenas Admins podem criar, atualizar, deletar rifas
router.post("/", autenticacao, apenasAdministrador, rifaController.criar);
router.put("/:id", autenticacao, apenasAdministrador, rifaController.atualizar);
router.delete("/:id", autenticacao, apenasAdministrador, rifaController.deletar);

// Utilizadores e Admins podem ver rifas
router.get("/", autenticacao, rifaController.listar);
router.get("/:id", autenticacao, rifaController.obterPorId);

router.post("/:id/sortear", autenticacao, apenasAdministrador, rifaController.sortear);

module.exports = router;