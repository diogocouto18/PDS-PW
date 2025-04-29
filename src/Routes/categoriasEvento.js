const express = require("express");
const router = express.Router();
const categoriaEventoController = require("../Controllers/categoriaEventoController");

const {autenticacao, apenasAdministrador} = require("../Middlewares/authMiddlewares");

// Criar uma categoria (apenas administrador)
router.post("/", autenticacao, apenasAdministrador, categoriaEventoController.criar);

// Lista todas as categorias existentes (qualquer utilizador)
router.get("/", autenticacao, categoriaEventoController.listar);

// Obtem uma categoria existente por id (qualquer utilizador)
router.get("/:id", autenticacao, categoriaEventoController.obterPorId);

// Atualiza uma categoria existente (apenas administrador)
router.put("/:id", autenticacao, apenasAdministrador, categoriaEventoController.atualizar);

// Remove uma categoria existente (apenas administrador)
router.delete("/:id", autenticacao, apenasAdministrador, categoriaEventoController.eliminar);

module.exports = router;