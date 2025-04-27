const pagamentoService = require("../Services/pagamentoService");

exports.confirmar = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // "Pago" ou "Falhado"
        const pagamentoAtualizado = await pagamentoService.confirmarPagamento(id, estado);
        res.json(pagamentoAtualizado);
    } catch (error) {
        console.error("Erro ao confirmar pagamento:", error);
        res.status(400).json({ error: error.message || "Erro ao confirmar pagamento." });
    }
};