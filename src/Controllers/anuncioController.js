const anuncioService = require("../services/anuncioService");

exports.criarAnuncio = async (req, res) => {
    try {
        // Ex.: body = { cargo, descricao, id_administrador, id_evento, ... }
        const novoAnuncio = await anuncioService.criarAnuncio(req.body);
        res.status(201).json(novoAnuncio);
    } catch (error) {
        console.error("Erro ao criar anúncio:", error);
        res.status(500).json({ error: "Erro ao criar anúncio" });
    }
};

exports.listarAnuncios = async (req, res) => {
    try {
        // Se quiser filtrar por evento, pode receber query param: ?id_evento=3
        const { id_evento } = req.query;
        const anuncios = await anuncioService.listarAnuncios(id_evento);
        res.json(anuncios);
    } catch (error) {
        console.error("Erro ao listar anúncios:", error);
        res.status(500).json({ error: "Erro ao buscar anúncios" });
    }
};

exports.obterAnuncioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const anuncio = await anuncioService.obterAnuncioPorId(id);
        if (!anuncio) return res.status(404).json({ error: "Anúncio não encontrado" });
        res.json(anuncio);
    } catch (error) {
        console.error("Erro ao obter anúncio:", error);
        res.status(500).json({ error: "Erro ao buscar anúncio" });
    }
};
