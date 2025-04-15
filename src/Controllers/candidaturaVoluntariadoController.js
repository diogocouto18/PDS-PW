const candidaturaService = require("../services/candidaturaVoluntariadoService");

exports.criarCandidatura = async (req, res) => {
    try {
        // Ex. body = { id_utilizador, id_anuncio }
        const candidatura = await candidaturaService.criarCandidatura(req.body);
        res.status(201).json(candidatura);
    } catch (error) {
        console.error("Erro ao criar candidatura:", error);
        res.status(500).json({ error: error.message || "Erro ao criar candidatura" });
    }
};

exports.listarCandidaturas = async (req, res) => {
    try {
        const candidaturas = await candidaturaService.listarCandidaturas();
        res.json(candidaturas);
    } catch (error) {
        console.error("Erro ao listar candidaturas:", error);
        res.status(500).json({ error: "Erro ao buscar candidaturas" });
    }
};

exports.obterCandidatura = async (req, res) => {
    try {
        const { id } = req.params;
        const candidatura = await candidaturaService.obterCandidatura(id);
        if (!candidatura) return res.status(404).json({ error: "Candidatura não encontrada" });
        res.json(candidatura);
    } catch (error) {
        console.error("Erro ao obter candidatura:", error);
        res.status(500).json({ error: "Erro ao buscar candidatura" });
    }
};

exports.avaliarCandidatura = async (req, res) => {
    try {
        const { id } = req.params;
        // Ex.: body = { estado: "Aceite" ou "Rejeitado" }
        const { estado } = req.body;
        const candidaturaAvaliada = await candidaturaService.avaliarCandidatura(id, estado);
        res.json(candidaturaAvaliada);
    } catch (error) {
        console.error("Erro ao avaliar candidatura:", error);
        res.status(500).json({ error: error.message || "Erro ao avaliar candidatura" });
    }
};
