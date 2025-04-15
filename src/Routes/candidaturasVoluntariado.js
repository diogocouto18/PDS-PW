const express = require("express");
const router = express.Router();
const candidaturaController = require("../controllers/candidaturaVoluntariadoController");

// Criar candidatura
router.post("/", candidaturaController.criarCandidatura);

// Listar candidaturas (opcional, ex.: do admin para avaliar)
router.get("/", candidaturaController.listarCandidaturas);

// Obter candidatura específica
router.get("/:id", candidaturaController.obterCandidatura);

// Avaliar candidatura (Aceite ou Rejeitado)
router.put("/:id/avaliar", candidaturaController.avaliarCandidatura);

module.exports = router;
