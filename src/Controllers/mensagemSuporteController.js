const mensagemService = require("../services/mensagemSuporteService");

const enviarMensagem = async (req, res) => {
    try {
        const { id } = req.params; // id do ticket (Suporte)
        // O body deve conter: { id_utilizador, id_administrador, mensagem }
        const mensagem = await mensagemService.enviarMensagem(id, req.body);
        res.status(201).json(mensagem);
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        res.status(500).json({ error: error.message || "Erro ao enviar mensagem" });
    }
};

module.exports = { enviarMensagem };
