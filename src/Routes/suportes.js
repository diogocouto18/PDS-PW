const express = require("express");
const router = express.Router();
const suporteController = require("../Controllers/suporteController");
const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");

// Criar novo artigo de suporte (apenas administrador)
router.post("/artigos", autenticacao, apenasAdministrador, suporteController.criarArtigo);

// Lista todos os artigos de suporte (qualquer utilizador)
router.get("/artigos", autenticacao, suporteController.listarArtigos);

// Ver um artigo de suporte específico (qualquer utilizador)
router.get("/artigos/:id", autenticacao, suporteController.obterArtigoPorId);

// Atualizar artigo de suporte (apenas administrador)
router.put("/artigos/:id", autenticacao, apenasAdministrador, suporteController.atualizarArtigo);

// Remover um artigo de suporte (apenas administrador)
router.delete("/artigos/:id", autenticacao, apenasAdministrador, suporteController.eliminarArtigo);

module.exports = router;