const candidaturaService = require("../Services/candidaturaVoluntariadoService");

// Post - Cria uma nova candidatura
async function criarCandidatura(req, res) {
  try {
    const { id } = req.utilizador;
    const candidaturaData = {
      id_utilizador: id,
      id_anuncio: req.body.id_anuncio,
      mensagem: req.body.mensagem
    };
    const candidatura = await candidaturaService.criarCandidatura(candidaturaData);
    res.status(201).json(candidatura);
  }  
    catch (error) {
    console.error("Erro ao criar candidatura:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Put - Avalia as candidaturas existentes para um anuncio
async function avaliarCandidatura(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const idAdministrador = req.utilizador.id;
    const candidaturaAvaliada = await candidaturaService.avaliarCandidatura(id, estado, idAdministrador);
    res.json(candidaturaAvaliada);
  }
    catch (error) {
    console.error("Erro ao avaliar candidatura:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get - Lista todas as candidaturas existentes de um anuncio
async function listarPorAnuncio(req, res) {
  try {
    const { id_anuncio } = req.params;
    const candidaturas = await candidaturaService.listarPorAnuncio(id_anuncio);
    res.json(candidaturas);
  }     catch (error) {
    console.error("Erro ao listar candidaturas:", error.message);
    res.status(500).json({ error: "Erro ao buscar candidaturas" });
  }
}

// Get - Lista todas as candidaturas existentes
async function listarMinhas(req, res) {
  try {
    const id_utilizador = req.utilizador.id;
    const candidaturas = await candidaturaService.listarMinhasCandidaturas(id_utilizador);
    res.json(candidaturas);
  } catch (error) {
    console.error("Erro ao listar candidaturas do utilizador:", error);
    res.status(500).json({ error: "Erro interno ao buscar candidaturas" });
  }
};

// Delete - Remove uma candidatura existente
async function eliminarCandidatura(req, res) {
  try {
    const { id } = req.params;
    await candidaturaService.removerCandidatura(id);
    res.json({ message: "Candidatura removida com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover candidatura" });
  }
};

module.exports = {
    criarCandidatura,
    avaliarCandidatura,
    listarPorAnuncio,
    listarMinhas,
    eliminarCandidatura
};