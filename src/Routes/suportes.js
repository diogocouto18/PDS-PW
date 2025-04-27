const express = require("express");
const router = express.Router();
const suporteController = require("../Controllers/suporteController");
const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Criar novo artigo
router.post("/artigos", autenticacao, apenasAdministrador, suporteController.criarArtigo);

// Ver todos os artigos
router.get("/artigos", autenticacao, suporteController.listarArtigos);

// Ver um artigo específico
router.get("/artigos/:id", autenticacao, suporteController.obterArtigoPorId);

// Atualizar artigo
router.put("/artigos/:id", autenticacao, apenasAdministrador, suporteController.atualizarArtigo);

// Eliminar artigo
router.delete("/artigos/:id", autenticacao, apenasAdministrador, suporteController.eliminarArtigo);

module.exports = router;