const utilizadorService = require("../Services/utilizadorService.js");


const criarUtilizador = async (req, res) => {
    try {
        const novoUtilizador = await utilizadorService.criarUtilizador(req.body);
        res.status(201).json(novoUtilizador);
    } catch (error) {
        console.error("Erro ao criar utilizador:", error);
        res.status(500).json({ error: "Erro ao criar utilizador" });
    }
};


const listarUtilizadores = async (req, res) => {
    try {
        const registros = await utilizadorService.listarUtilizadores();
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar utilizadores" });
    }
};

const obterPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const registro = await utilizadorService.obterPorId(id);
        if (!registro) return res.status(404).json({ error: "Utilizador não encontrado" });
        res.json(registro);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar utilizador" });
    }
};

const atualizarUtilizadores = async (req, res) => {
    try {
        const { id } = req.params;
        const atualizado = await utilizadorService.atualizarUtilizadores(id, req.body);
        res.json(atualizado);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar utilizador" });
    }
};

const eliminarUtilizadores = async (req, res) => {
    try {
        const { id } = req.params;
        await utilizadorService.eliminarUtilizadores(id);
        res.json({ message: "Utilizador deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar utilizador" });
    }
};

module.exports = {
    criarUtilizador,
    listarUtilizadores,
    obterPorId,
    atualizarUtilizadores,
    eliminarUtilizadores,
};

