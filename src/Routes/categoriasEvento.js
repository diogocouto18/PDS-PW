const express = require("express");
const router = express.Router();
const categoriaEventoController = require("../Controllers/categoriaEventoController");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

router.get("/", autenticacao, categoriaEventoController.listar);
router.get("/:id", autenticacao, categoriaEventoController.obterPorId);

router.post("/", autenticacao, apenasAdministrador, categoriaEventoController.criar);
router.put("/:id", autenticacao, apenasAdministrador, categoriaEventoController.atualizar);
router.delete("/:id", autenticacao, apenasAdministrador, categoriaEventoController.eliminar);

module.exports = router;