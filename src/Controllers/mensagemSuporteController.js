const mensagemSuporteService = require("../Services/mensagemSuporteService");
const { v4: uuidv4 } = require('uuid');

// Post - Cria mensagem inicial e abre o ticket
async function criarMensagemInicial(req, res) {
  try {
    const { id } = req.utilizador;
    const data = {
      id_ticket: uuidv4(),
      id_utilizador: id,
      mensagem: req.body.mensagem,
    };
    const mensagem = await mensagemSuporteService.criarMensagemInicial(data);
    res.status(201).json(mensagem);
  } 
    catch (error) {
    console.error("Erro ao criar mensagem:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/* Post - Envio de uma resposta
async function enviarResposta(req, res) {
  try {
    const { id_ticket } = req.params;
    const userId = req.utilizador.id;
    const isAdmin = req.utilizador.tipo === "Administrador";
  
    const data = {
      id_ticket,
      mensagem: req.body.mensagem,
      id_utilizador: isAdmin ? null : userId,
      id_administrador: isAdmin ? userId : null,
    };
  
    const resposta = await mensagemSuporteService.enviarResposta(data);
    res.json(resposta);
  } 
    catch (error) {
    console.error("Erro ao enviar resposta:", error.message);
    res.status(500).json({ error: error.message });
  }
};*/

async function enviarResposta(req, res) {
  try {
    const { id_ticket } = req.params;
    const userId = req.utilizador.id;
    const isAdmin = req.utilizador.role === "Administrador";

    const data = {
      id_ticket,
      mensagem: req.body.mensagem,
      ...(isAdmin
        ? { id_administrador: userId }
        : { id_utilizador: userId }),
    };

    const resposta = isAdmin
      ? await mensagemSuporteService.enviarRespostaAdministrador(data)
      : await mensagemSuporteService.enviarRespostaUtilizador(data);

    res.json(resposta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Put - Fecha o ticket, atualizando o estado de todas as mensagens
async function fecharTicket(req, res) {
  try {
    const { id_ticket } = req.params;
    const updates = await mensagemSuporteService.fecharTicket(id_ticket);
    res.json({ message: "Ticket fechado com sucesso.", updates });
  } 
    catch (error) {
    console.error("Erro ao fechar ticket:", error.message);
    res.status(500).json({ error: error.message });
  }
};
  
// Get - Lista todas as mensagens de um ticket 
async function listarMensagensDoTicket(req, res) {
  try {
    const { id_ticket } = req.params;
    const mensagens = await mensagemSuporteService.listarMensagensDoTicket(id_ticket);
    res.json(mensagens);
  } 
    catch (error) {
    console.error("Erro ao listar mensagens:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete - Remover um ticket existente
async function eliminarTicket(req, res) {
  try {
    const { id_ticket } = req.params;
    await mensagemSuporteService.removerTicket(id_ticket);
    res.json({ message: "Ticket removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover ticket" });
  }
};

async function verificarTicket(req, res) {
  try {
    const { id } = req.utilizador;
    const ticket = await mensagemSuporteService.verificarTicketAberto(id);
    res.json(ticket || {}); // mantém comportamento esperado no front
  } catch (error) {
    console.error("Erro ao verificar ticket:", error.message);
    res.status(500).json({ error: error.message });
  }
}


const listarTickets = async (req, res) => {
  try {
    const tickets = await mensagemSuporteService.listarTickets();
    res.json(tickets);
  } catch (error) {
    console.error("Erro ao listar tickets:", error);
    res.status(500).json({ error: "Erro ao listar tickets" });
  }
};

async function getTicketDetalhadoUtilizador(req, res) {
  try {
    const { id } = req.utilizador;
    const ticket = await mensagemSuporteService.getTicketComMensagensParaUtilizador(id);

    if (!ticket) return res.status(404).json({ message: "Nenhum ticket encontrado." });

    res.json(ticket);
  } catch (err) {
    console.error("Erro ao buscar ticket detalhado:", err.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = {
    criarMensagemInicial,
    enviarResposta,
    fecharTicket,
    listarMensagensDoTicket,
    eliminarTicket,
    verificarTicket,
    listarTickets,
    getTicketDetalhadoUtilizador
};
