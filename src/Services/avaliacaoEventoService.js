const avaliacaoService = require("../Services/avaliacaoEventoService");

// Post - Cria uma avaliação (uma por utilizador/evento) e retorna média atualizada
async function criarAvaliacao(req, res) {
  try {
    const { id } = req.utilizador;
    const data = {
      id_utilizador: id,
      id_evento: req.body.id_evento,
      nota: req.body.nota,
    };

    // Verifica se já avaliou
    const avaliacoesDoEvento = await avaliacaoService.listarPorEvento(data.id_evento);
    const jaAvaliou = avaliacoesDoEvento.find(a => a.id_utilizador === id);

    if (jaAvaliou) {
      return res.status(400).json({ error: "Já avaliou este evento." });
    }

    const novaAvaliacao = await avaliacaoService.criarAvaliacao(data);
    const media = await avaliacaoService.mediaDoEvento(data.id_evento);

    res.status(201).json({ avaliacao: novaAvaliacao, media });
  } catch (error) {
    console.error("Erro ao criar avaliação:", error.message);
    res.status(400).json({ error: error.message });
  }
}

// Get - Lista avaliações de um evento
async function listarPorEvento(req, res) {
  try {
    const avaliacoes = await avaliacaoService.listarPorEvento(req.params.id_evento);
    res.json(avaliacoes);
  } catch (error) {
    console.error("Erro ao listar avaliações:", error.message);
    res.status(500).json({ error: "Erro ao listar avaliações" });
  }
}

// Put - Atualiza a avaliação de um evento
async function atualizarAvaliacao(req, res) {
  try {
    const idAvaliacao = req.params.id;
    const existente = await avaliacaoService.obterPorId(idAvaliacao);
    if (!existente) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }
    if (existente.id_utilizador !== req.utilizador.id) {
      return res.status(403).json({ error: "Só podes atualizar a tua própria avaliação" });
    }

    const atualizacao = await avaliacaoService.atualizarAvaliacao(idAvaliacao, req.body);
    const media = await avaliacaoService.mediaDoEvento(atualizacao.id_evento);

    res.json({ avaliacao: atualizacao, media });
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error.message);
    res.status(400).json({ error: error.message });
  }
}

// Delete - Remove uma avaliação de um evento
async function eliminarAvaliacao(req, res) {
  try {
    await avaliacaoService.eliminarAvaliacao(req.params.id);
    res.json({ message: "Avaliação removida com sucesso" });
  } catch (error) {
    console.error("Erro ao apagar avaliação:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Get - Calcula a média de avaliações de um evento
async function mediaDoEvento(req, res) {
  try {
    const media = await avaliacaoService.mediaDoEvento(req.params.id_evento);
    res.json({ media });
  } catch (error) {
    console.error("Erro ao calcular média:", error.message);
    res.status(500).json({ error: "Erro ao calcular média" });
  }
}

module.exports = {
  criarAvaliacao,
  listarPorEvento,
  atualizarAvaliacao,
  eliminarAvaliacao,
  mediaDoEvento,
};