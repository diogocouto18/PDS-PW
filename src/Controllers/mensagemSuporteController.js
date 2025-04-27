const mensagemSuporteService = require("../Services/mensagemSuporteService");

const criarMensagemInicial = async (req, res) => {
    try {
      const { id } = req.utilizador; // ID do user logado
      const data = {
        id_ticket: Date.now(), // Gera um id único para ticket (pode melhorar para production)
        id_utilizador: id,
        mensagem: req.body.mensagem,
      };
  
      const mensagem = await mensagemSuporteService.criarMensagemInicial(data);
      res.status(201).json(mensagem);
    } catch (error) {
      console.error("Erro ao criar mensagem:", error.message);
      res.status(500).json({ error: error.message });
    }
};

const enviarResposta = async (req, res) => {
    try {
      const { id_ticket } = req.params;
      const userId = req.utilizador.id;
      const isAdmin = req.utilizador.tipo === "Administrador"; // Assume que tens um campo tipo
  
      const data = {
        id_ticket,
        mensagem: req.body.mensagem,
        id_utilizador: isAdmin ? null : userId,
        id_administrador: isAdmin ? userId : null,
      };
  
      const resposta = await mensagemSuporteService.enviarResposta(data);
      res.json(resposta);
    } catch (error) {
      console.error("Erro ao enviar resposta:", error.message);
      res.status(500).json({ error: error.message });
    }
};

const fecharTicket = async (req, res) => {
    try {
      const { id_ticket } = req.params;
      const updates = await mensagemSuporteService.fecharTicket(id_ticket);
      res.json({ message: "Ticket fechado com sucesso.", updates });
    } catch (error) {
      console.error("Erro ao fechar ticket:", error.message);
      res.status(500).json({ error: error.message });
    }
};
  
  
const listarMensagensDoTicket = async (req, res) => {
    try {
      const { id_ticket } = req.params;
      const mensagens = await mensagemSuporteService.listarMensagensDoTicket(id_ticket);
      res.json(mensagens);
    } catch (error) {
      console.error("Erro ao listar mensagens:", error.message);
      res.status(500).json({ error: error.message });
    }
};

module.exports = {
    criarMensagemInicial,
    enviarResposta,
    fecharTicket,
    listarMensagensDoTicket
};
