const categoriaEventoService = require("../services/categoriaEventoService");

const listar = async (req, res) => {
    try {
        const categorias = await categoriaEventoService.obterTodos();
        res.json(categorias);
    } catch (error) {
        console.error("Erro ao listar categorias:", error);
        res.status(500).json({ error: "Erro ao buscar categorias" });
    }
};

const obterPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await categoriaEventoService.obterPorId(id);
        if (!categoria) return res.status(404).json({ error: "Categoria não encontrada" });
        res.json(categoria);
    } catch (error) {
        console.error("Erro ao obter categoria:", error);
        res.status(500).json({ error: "Erro ao buscar categoria" });
    }
};

const criar = async (req, res) => {
    try {
        const novaCategoria = await categoriaEventoService.criar(req.body);
        res.status(201).json(novaCategoria);
    } catch (error) {
        console.error("Erro ao criar categoria:", error);
        res.status(500).json({ error: "Erro ao criar categoria" });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaAtualizada = await categoriaEventoService.atualizar(id, req.body);
        res.json(categoriaAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
};

const deletar = async (req, res) => {
    try {
        const { id } = req.params;
        await categoriaEventoService.deletar(id);
        res.json({ message: "Categoria apagada com sucesso" });
    } catch (error) {
        console.error("Erro ao apagar categoria:", error);
        res.status(500).json({ error: "Erro ao apagar categoria" });
    }
};

module.exports = {
    listar,
    obterPorId,
    criar,
    atualizar,
    deletar,
};