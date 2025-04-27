const express = require("express");
const router = express.Router();
const utilizadorController = require("../Controllers/utilizadorController.js");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

router.post("/", utilizadorController.criarUtilizador);
router.get("/", autenticacao, apenasAdministrador, utilizadorController.listarUtilizadores);
router.get("/:id", autenticacao, apenasAdministrador, utilizadorController.obterPorId);
router.put("/:id", autenticacao, apenasAdministrador, utilizadorController.atualizarUtilizadores);
router.delete("/:id", autenticacao, apenasAdministrador, utilizadorController.eliminarUtilizadores);

module.exports = router;
