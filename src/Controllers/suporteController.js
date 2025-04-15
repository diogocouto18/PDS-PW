const suporteService = require("../services/suporteService");

const criarTicket = async (req, res) => {
    try {
        // Espera receber no body: { artigo, descricao, id_utilizador (se houver) }
        const ticket = await suporteService.criarTicket(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        console.error("Erro ao criar ticket:", error);
        res.status(500).json({ error: error.message || "Erro ao criar ticket" });
    }
};

const obterTicketPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await suporteService.obterTicketPorId(id);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket não encontrado" });
        }
        res.json(ticket);
    } catch (error) {
        console.error("Erro ao obter ticket:", error);
        res.status(500).json({ error: "Erro ao buscar ticket" });
    }
};

const resolverTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await suporteService.resolverTicket(id);
        res.json(resultado);
    } catch (error) {
        console.error("Erro ao resolver ticket:", error);
        res.status(500).json({ error: error.message || "Erro ao resolver ticket" });
    }
};

module.exports = {
    criarTicket,
    obterTicketPorId,
    resolverTicket,
};
