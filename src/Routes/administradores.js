const express = require("express");
const router = express.Router();
const administradorController = require("../controllers/administradorController");

router.get("/", administradorController.listar);
router.get("/:id", administradorController.obterPorId);
router.post("/", administradorController.criar);
router.put("/:id", administradorController.atualizar);
router.delete("/:id", administradorController.deletar);

module.exports = router;
