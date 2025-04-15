const eventoService = require("../services/eventoService");

exports.criarEvento = async (req, res) => {
    try {
        // Espera um body com dados do evento, ex.: { titulo, localizacao, data_evento, id_administrador, id_categoria, ... }
        const novoEvento = await eventoService.criarEvento(req.body);
        res.status(201).json(novoEvento);
    } catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ error: "Erro ao criar evento" });
    }
};

exports.listarEventos = async (req, res) => {
    try {
        const eventos = await eventoService.listarEventos();
        res.json(eventos);
    } catch (error) {
        console.error("Erro ao listar eventos:", error);
        res.status(500).json({ error: "Erro ao buscar eventos" });
    }
};

exports.obterEventoPorId = async (req, res) => {
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
