const eventoService = require("../Services/eventoService");

// Post - Cria um novo evento
async function criarEvento(req, res) {
    try {
        const { id } = req.utilizador;
        const eventoData = { ...req.body, id_administrador: id };
        const novoEvento = await eventoService.criarEvento(eventoData);
        res.status(201).json(novoEvento);
    } 
        catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ error: "Erro ao criar evento" });
    }
};

// Get - Lista todos os eventos existentes
async function listarEventos(req, res) {
    try {
        const eventos = await eventoService.listarEventos();
        res.json(eventos);
    } 
        catch (error) {
        console.error("Erro ao listar eventos:", error);
        res.status(500).json({ error: "Erro ao buscar eventos" });
    }
};

// Get - Obtem um evento por ID
async function obterEventoPorId(req, res) {
    try {
        const { id } = req.params;
        const evento = await eventoService.obterEventoPorId(id);
        if (!evento) return res.status(404).json({ error: "Evento não encontrado" });
        res.json(evento);
    } 
        catch (error) {
        console.error("Erro ao obter evento:", error);
        res.status(500).json({ error: "Erro ao buscar evento" });
    }
};

// Put - Atualiza um evento 
async function atualizarEvento(req, res) {
    try {
        const { id } = req.params;
        const eventoAtualizado = await eventoService.atualizarEvento(id, req.body);
        res.json(eventoAtualizado);
    } 
        catch (error) {
        console.error("Erro ao atualizar evento:", error.message);
        res.status(500).json({ error: "Erro ao atualizar evento" });
    }
};

// Delete - Remove um evento existente
async function eliminarEvento(req, res) {
    try {
        const { id } = req.params;
        await eventoService.eliminarEvento(id);
        res.json({ message: "Evento eliminado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao eliminar evento" });
    }
};

module.exports = {
    criarEvento,
    listarEventos,
    obterEventoPorId,
    atualizarEvento,
    eliminarEvento
};