const anuncioService = require("../Services/anuncioService");

// Post - Cria um anuncio para um evento 
async function criarAnuncio(req, res) {
try {
        const { id } = req.utilizador;
        const anuncioData = { ...req.body, id_administrador: id };
        const novoAnuncio = await anuncioService.criarAnuncio(anuncioData);
        res.status(201).json(novoAnuncio);
    } 
        catch (error) {
        console.error("Erro ao criar anúncio:", error);
        res.status(500).json({ error: "Erro ao criar anúncio" });
    }
};

// Get - Lista todos os anuncios existentes de um evento
async function listarAnuncios(req, res)  {
    try {
        // Se quiser filtrar por evento, pode receber query param: ?id_evento=3
        const { id_evento } = req.query;
        const anuncios = await anuncioService.listarAnuncios(id_evento);
        res.json(anuncios);
    } 
        catch (error) {
        console.error("Erro ao listar anúncios:", error);
        res.status(500).json({ error: "Erro ao buscar anúncios" });
    }
};

// Get - Obtem um anuncio existente por ID
async function obterAnuncioPorId(req, res) {
    try {
        const { id } = req.params;
        const anuncio = await anuncioService.obterAnuncioPorId(id);
        if (!anuncio) return res.status(404).json({ error: "Anúncio não encontrado" });
        res.json(anuncio);
    } 
        catch (error) {
        console.error("Erro ao obter anúncio:", error);
        res.status(500).json({ error: "Erro ao buscar anúncio" });
    }
};

// Put - Atualiza o estado de um anuncio
async function encerrarAnuncio(req, res) {
    try {
        const { id } = req.params;
        const anuncio = await anuncioService.encerrarAnuncio(id);
        res.json(anuncio);
    }   
        catch (error) {
        console.error("Erro ao encerrar anúncio:", error.message);
        res.status(500).json({ error: "Erro ao encerrar anúncio" });
    }
}

module.exports= {
    criarAnuncio,
    listarAnuncios,
    obterAnuncioPorId,
    encerrarAnuncio,
}