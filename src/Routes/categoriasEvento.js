const express = require("express");
const router = express.Router();
const categoriaEventoController = require("../controllers/categoriaEventoController");

router.get("/", categoriaEventoController.listar);
router.get("/:id", categoriaEventoController.obterPorId);
router.post("/", categoriaEventoController.criar);
router.put("/:id", categoriaEventoController.atualizar);
router.delete("/:id", categoriaEventoController.deletar);

module.exports = router;