const categoriaEventoService = require("../Services/categoriaEventoService");

// Post - Cria uma nova categoria
async function criar(req, res) {
    try {
        const novaCategoria = await categoriaEventoService.criar(req.body);
        res.status(201).json(novaCategoria);
    } 
        catch (error) {
        console.error("Erro ao criar categoria:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get - Lista todos as categorias existentes
async function listar(req, res) {
    try {
        const categorias = await categoriaEventoService.obterTodos();
        res.json(categorias);
    } 
        catch (error) {
        console.error("Erro ao listar categorias:", error.message);
        res.status(500).json({ error: "Erro ao buscar categorias" });
    }
};

// Get - Obtem uma categoria existente por ID
async function obterPorId(req, res) {
    try {
        const { id } = req.params;
        const categoria = await categoriaEventoService.obterPorId(id);
        if (!categoria) return res.status(404).json({ error: "Categoria não encontrada" });
        res.json(categoria);
    } 
        catch (error) {
        console.error("Erro ao obter categoria:", error.message);
        res.status(500).json({ error: "Erro ao encontrar categoria" });
    }
};

// Put - Atualiza uma categoria existente
async function atualizar(req, res) {
    try {
        const { id } = req.params;
        const categoriaAtualizada = await categoriaEventoService.atualizar(id, req.body);
        res.json(categoriaAtualizada);
    } 
        catch (error) {
        console.error("Erro ao atualizar categoria:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Delete - Remove uma categoria existente
async function eliminar(req, res){
    try {
        const { id } = req.params;
        await categoriaEventoService.eliminar(id);
        res.json({ message: "Categoria apagada com sucesso" });
    } 
        catch (error) {
        console.error("Erro ao apagar categoria:", error);
        res.status(500).json({ error: "Erro ao apagar categoria" });
    }
};

module.exports = {
    listar,
    obterPorId,
    criar,
    atualizar,
    eliminar,
};