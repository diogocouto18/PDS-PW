const candidaturaService = require("../Services/candidaturaVoluntariadoService");

// Post - Cria uma nova candidatura
async function criarCandidatura(req, res) {
    try {
        const { id } = req.utilizador;
        const candidaturaData = {
            id_utilizador: id,
            id_anuncio: req.body.id_anuncio
        };

        const candidatura = await candidaturaService.criarCandidatura(candidaturaData);
        res.status(201).json(candidatura);

    }   
        catch (error) {
        console.error("Erro ao criar candidatura:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Put - Avalia as candidaturas existentes para um anuncio
async function avaliarCandidatura(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const idAdministrador = req.utilizador.id;
        const candidaturaAvaliada = await candidaturaService.avaliarCandidatura(id, estado, idAdministrador);
        res.json(candidaturaAvaliada);
    } 
        catch (error) {
        console.error("Erro ao avaliar candidatura:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get - Lista todas as candidaturas existentes de um anuncio
async function listarPorAnuncio(req, res) {
    try {
        const { id_anuncio } = req.params;
        const candidaturas = await candidaturaService.listarPorAnuncio(id_anuncio);
        res.json(candidaturas);
    } 
        catch (error) {
        console.error("Erro ao listar candidaturas:", error.message);
        res.status(500).json({ error: "Erro ao buscar candidaturas" });
    }
};


module.exports = {
    criarCandidatura,
    avaliarCandidatura,
    listarPorAnuncio,
};