const suporteService = require("../Services/suporteService");

// Post - Cria um novo artigo de suporte
async function criarArtigo(req, res) {
    try {
        const novoArtigo = await suporteService.criarArtigo(req.body);
        res.status(201).json(novoArtigo);
    } 
        catch (error) {
        console.error("Erro ao criar artigo de suporte:", error.message);
        res.status(500).json({ error: "Erro ao criar artigo" });
    }
};

// Get - Lista todos os artigos de suporte 
async function listarArtigos(req, res) {
    try {
        const artigos = await suporteService.listarArtigos();
        res.json(artigos);
    } 
        catch (error) {
        console.error("Erro ao listar artigos de suporte:", error.message);
        res.status(500).json({ error: "Erro ao listar artigos de suporte" });
    }
};

// Get - Obtem um artigo de suporte existente pelo seu ID
async function obterArtigoPorId(req, res) {
    try {
        const { id } = req.params;
        const artigo = await suporteService.obterArtigoPorId(id);
        if (!artigo) return res.status(404).json({ error: "Artigo não encontrado" });
        res.json(artigo);
    } 
        catch (error) {
        console.error("Erro ao obter artigo:", error.message);
        res.status(500).json({ error: "Erro ao obter artigo" });
    }
};

// Put - Atualiza um artigo de suporte existente
async function atualizarArtigo(req, res) {
    try {
        const { id } = req.params;
        const artigoAtualizado = await suporteService.atualizarArtigo(id, req.body);
        res.json(artigoAtualizado);
    } 
        catch (error) {
        console.error("Erro ao atualizar artigo de suporte:", error.message);
        res.status(500).json({ error: "Erro ao atualizar artigo" });
    }
};

// Delete - Remove um artiogo de suporte existente
async function eliminarArtigo(req, res) {
    try {
        const { id } = req.params;
        await suporteService.eliminarArtigo(id);
        res.json({ message: "Artigo eliminado com sucesso" });
    } 
        catch (error) {
        console.error("Erro ao eliminar artigo de suporte:", error.message);
        res.status(500).json({ error: "Erro ao eliminar artigo" });
    }
};

module.exports = {
    criarArtigo,
    listarArtigos,
    obterArtigoPorId,
    atualizarArtigo,
    eliminarArtigo,
};