const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const notificacaoService = require("../Services/notificacaoService"); 

// 1. Utilizador cria mensagem (abre ticket)
const criarMensagemInicial = async (data) => {
    const mensagem = await prisma.mensagemSuporte.create({
        data: {
            id_ticket: data.id_ticket,
            mensagem: data.mensagem,
            estado: "Aberto",
            data_abertura: new Date(),
            Utilizador: {
                connect: { id: data.id_utilizador }
            }
        }
    });
    return mensagem;
};


const enviarResposta = async (data) => {
    const ticket = await prisma.mensagemSuporte.findFirst({
      where: { id_ticket: parseInt(data.id_ticket) },
    });
  
    if (!ticket) {
      throw new Error("Ticket não encontrado");
    }
  
    if (ticket.estado === "Fechado") {
      throw new Error("Ticket já está fechado.");
    }
  
    const novaMensagem = await prisma.mensagemSuporte.create({
      data: {
        id_ticket: parseInt(data.id_ticket),
        id_utilizador: data.id_utilizador || null,
        id_administrador: data.id_administrador || null,
        mensagem: data.mensagem,
        estado: "Aberto",
        data_abertura: new Date(),
      },
    });

    if (data.id_administrador) {
        await notificacaoService.criarNotificacao({
          id_utilizador: ticket.id_utilizador,
          id_administrador: data.id_administrador,
          mensagem: "O administrador respondeu ao seu ticket de suporte.",
          estado: "Por_abrir",
        });
    }
    
    return novaMensagem;
};

// 3. Fechar Ticket (admin encerra a conversa)
const fecharTicket = async (id_ticket) => {
    const mensagens = await prisma.mensagemSuporte.findMany({
      where: { id_ticket: parseInt(id_ticket), estado: "Aberto" },
    });
  
    if (mensagens.length === 0) {
      throw new Error("Nenhuma mensagem aberta encontrada para este ticket.");
    }
  
    const updates = await Promise.all(
      mensagens.map((mensagem) =>
        prisma.mensagemSuporte.update({
          where: { id: mensagem.id },
          data: {
            estado: "Fechado",
            data_encerramento: new Date(),
          },
        })
      )
    );
  
    return updates;
};

// 4. Listar todas as mensagens de um ticket
const listarMensagensDoTicket = async (id_ticket) => {
    return await prisma.mensagemSuporte.findMany({
      where: { id_ticket: parseInt(id_ticket) },
      orderBy: { data_abertura: "asc" },
    });
};

module.exports = { 
    criarMensagemInicial, 
    enviarResposta, 
    fecharTicket,
    listarMensagensDoTicket,
};
