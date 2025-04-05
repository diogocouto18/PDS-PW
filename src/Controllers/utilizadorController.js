const utilizadorService = require("../services/utilizadorService.js");

const listar = async (req, res) => {
    try {
        const registros = await utilizadorService.obterTodos();
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

const criar = async (req, res) => {
    try {
        const novoUtilizador = await utilizadorService.criar(req.body);
        res.status(201).json(novoUtilizador);
    } catch (error) {
        console.error("Erro ao criar utilizador:", error);
        res.status(500).json({ error: "Erro ao criar utilizador" });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const atualizado = await utilizadorService.atualizar(id, req.body);
        res.json(atualizado);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar utilizador" });
    }
};

const deletar = async (req, res) => {
    try {
        const { id } = req.params;
        await utilizadorService.deletar(id);
        res.json({ message: "Utilizador deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar utilizador" });
    }
};

module.exports = {
    listar,
    obterPorId,
    criar,
    atualizar,
    deletar,
};

