const eventoService = require("../Services/eventoService");

async function criarEvento(req, res) {
    try {
        // Espera um body com dados do evento, ex.: { titulo, localizacao, data_evento, id_administrador, id_categoria, ... }
        const { id } = req.utilizador;
        const eventoData = { ...req.body, id_administrador: id };
        const novoEvento = await eventoService.criarEvento(eventoData);
        res.status(201).json(novoEvento);
    } catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ error: "Erro ao criar evento" });
    }
};

async function listarEventos(req, res) {
    try {
        const eventos = await eventoService.listarEventos();
        res.json(eventos);
    } catch (error) {
        console.error("Erro ao listar eventos:", error);
        res.status(500).json({ error: "Erro ao buscar eventos" });
    }
};

async function obterEventoPorId(req, res) {
    try {
        const { id } = req.params;
        const evento = await eventoService.obterEventoPorId(id);
        if (!evento) return res.status(404).json({ error: "Evento não encontrado" });
        res.json(evento);
    } catch (error) {
        console.error("Erro ao obter evento:", error);
        res.status(500).json({ error: "Erro ao buscar evento" });
    }
};

async function atualizarEvento(req, res) {
    try {
      const { id } = req.params;
      const eventoAtualizado = await eventoService.atualizarEvento(id, req.body);
      res.json(eventoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar evento:", error.message);
      res.status(500).json({ error: "Erro ao atualizar evento" });
    }
  }

module.exports = {
    criarEvento,
    listarEventos,
    obterEventoPorId,
    atualizarEvento,
};