const express = require("express");
const router = express.Router();
const administradorController = require("../Controllers/administradorController");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

router.post("/", administradorController.criarAdministrador);
router.get("/", autenticacao, apenasAdministrador, administradorController.listarAdministradores);
router.get("/:id", autenticacao, apenasAdministrador, administradorController.obterPorId);
router.put("/:id", autenticacao, apenasAdministrador, administradorController.atualizarAdministradores);
router.delete("/:id", autenticacao, apenasAdministrador, administradorController.eliminarAdministradores);

module.exports = router;
