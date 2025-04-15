const rifaService = require("../services/rifaService");

exports.criarRifa = async (req, res) => {
    try {
        // Exemplo body: { nome, preco, quantidade, descricao, premio, data_sorteio, id_evento, id_administrador }
        const rifa = await rifaService.criarRifa(req.body);
        res.status(201).json(rifa);
    } catch (error) {
        console.error("Erro ao criar rifa:", error);
        res.status(500).json({ error: error.message || "Erro ao criar rifa" });
    }
};

exports.listarRifas = async (req, res) => {
    try {
        // Pode filtrar por id_evento se quiser
        const rifas = await rifaService.listarRifas(req.query.id_evento);
        res.json(rifas);
    } catch (error) {
        console.error("Erro ao listar rifas:", error);
        res.status(500).json({ error: "Erro ao buscar rifas" });
    }
};

exports.obterRifa = async (req, res) => {
    try {
        const { id } = req.params;
        const rifa = await rifaService.obterRifa(id);
        if (!rifa) return res.status(404).json({ error: "Rifa não encontrada" });
        res.json(rifa);
    } catch (error) {
        console.error("Erro ao obter rifa:", error);
        res.status(500).json({ error: "Erro ao buscar rifa" });
    }
};

exports.sortearRifa = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await rifaService.sortearRifa(id);
        res.json(resultado);
    } catch (error) {
        console.error("Erro ao sortear rifa:", error);
        res.status(500).json({ error: error.message || "Erro ao sortear rifa" });
    }
};
