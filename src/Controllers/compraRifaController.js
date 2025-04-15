const compraRifaService = require("../services/compraRifaService");

exports.criarCompra = async (req, res) => {
    try {
        // body = { id_utilizador, id_rifa, quantidade }
        const compra = await compraRifaService.criarCompra(req.body);
        res.status(201).json(compra);
    } catch (error) {
        console.error("Erro ao criar compra de rifa:", error);
        res.status(500).json({ error: error.message || "Erro ao criar compra" });
    }
};

exports.confirmarPagamento = async (req, res) => {
    try {
        const { id } = req.params;
        // body = { metodoPagamento, valor, etc. (opcional) }
        const compraPaga = await compraRifaService.confirmarPagamento(id, req.body);
        res.json(compraPaga);
    } catch (error) {
        console.error("Erro ao confirmar pagamento:", error);
        res.status(500).json({ error: error.message || "Erro ao confirmar pagamento" });
    }
};
