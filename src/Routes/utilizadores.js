const express = require("express");
const router = express.Router();

const utilizadorController = require("../Controllers/utilizadorController.js");

router.get("/", utilizadorController.listar);
router.get("/:id", utilizadorController.obterPorId);
router.post("/", utilizadorController.criar);
router.put("/:id", utilizadorController.atualizar);
router.delete("/:id", utilizadorController.deletar);

module.exports = router;
