const rifaService = require("../Services/rifaService");

exports.criar = async (req, res) => {
    try {
        const novaRifa = await rifaService.criar(req.body);
        res.status(201).json(novaRifa);
    } catch (error) {
        console.error("Erro ao criar rifa:", error);
        res.status(500).json({ error: "Erro ao criar rifa" });
    }
};

exports.listar = async (req, res) => {
    try {
        const rifas = await rifaService.listar();
        res.json(rifas);
    } catch (error) {
        console.error("Erro ao listar rifas:", error);
        res.status(500).json({ error: "Erro ao buscar rifas" });
    }
};

exports.obterPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const rifa = await rifaService.obterPorId(id);
        if (!rifa) return res.status(404).json({ error: "Rifa não encontrada" });
        res.json(rifa);
    } catch (error) {
        console.error("Erro ao buscar rifa:", error);
        res.status(500).json({ error: "Erro ao buscar rifa" });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const rifaAtualizada = await rifaService.atualizar(id, req.body);
        res.json(rifaAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar rifa:", error);
        res.status(500).json({ error: "Erro ao atualizar rifa" });
    }
};

exports.deletar = async (req, res) => {
    try {
        const { id } = req.params;
        await rifaService.deletar(id);
        res.json({ message: "Rifa deletada com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar rifa:", error);
        res.status(500).json({ error: "Erro ao deletar rifa" });
    }
};

exports.sortear = async (req, res) => {
    try {
        const { id } = req.params;
        const idAdministrador = req.user.id; // Pegamos o ID do admin que fez o sorteio
        const resultado = await rifaService.sortearRifa(id, idAdministrador);
        res.json(resultado);
    } catch (error) {
        console.error("Erro ao sortear rifa:", error);
        res.status(400).json({ error: error.message || "Erro ao realizar sorteio." });
    }
};