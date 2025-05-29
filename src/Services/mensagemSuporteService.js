const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const notificacaoService = require("../Services/notificacaoService"); 

// Cria a primeira mensagem suporte, abrindo assim o ticket
const criarMensagemInicial = async (data) => {
  const mensagem = await prisma.mensagemSuporte.create({
    data: {
      id_ticket: data.id_ticket,
      mensagem: data.mensagem,
      estado: "Aberto",
      data_abertura: new Date(),                          
      id_utilizador: data.id_utilizador, 
    }
  });

  const administradores = await prisma.administrador.findMany({
    where: { ativo: true },
    select: { id: true }
  });

  await Promise.all(administradores.map(({ id }) =>
    notificacaoService.criarNotificacao({
      id_administrador: id,
      mensagem: "Novo ticket de suporte recebido.",
      estado: "Por_abrir"
    })
  ));

  return mensagem;
  
};

const enviarRespostaUtilizador = async (data) => {
  const ticket = await prisma.mensagemSuporte.findFirst({
    where: { id_ticket: data.id_ticket },
  });
  if (!ticket) throw new Error("Ticket não encontrado");
  if (ticket.estado === "Fechado") throw new Error("Ticket já está fechado.");

  const novaMensagem = await prisma.mensagemSuporte.create({
    data: {
      id_ticket: data.id_ticket,
      id_utilizador: data.id_utilizador,
      id_administrador: null,
      mensagem: data.mensagem,
      estado: "Aberto",
      data_abertura: new Date(),
    },
  });


  return novaMensagem;
};


const enviarRespostaAdministrador = async (data) => {
  const ticket = await prisma.mensagemSuporte.findFirst({
    where: { id_ticket: data.id_ticket },
  });
  if (!ticket) throw new Error("Ticket não encontrado");
  if (ticket.estado === "Fechado") throw new Error("Ticket já está fechado.");

  const novaMensagem = await prisma.mensagemSuporte.create({
    data: {
      id_ticket: data.id_ticket,
      id_administrador: data.id_administrador,
      id_utilizador: null,
      mensagem: data.mensagem,
      estado: "Aberto",
      data_abertura: new Date(),
    },
  });

  return novaMensagem;
};

/* Envia um resposta, mantendo o ticket aberto
const enviarResposta = async (data) => {
  const ticket = await prisma.mensagemSuporte.findFirst({
    where: { id_ticket: data.id_ticket },
  });
  
  if (!ticket) {
    throw new Error("Ticket não encontrado");
  }
  
  if (ticket.estado === "Fechado") {
    throw new Error("Ticket já está fechado.");
  }
  
  const novaMensagem = await prisma.mensagemSuporte.create({
    data: {
      id_ticket: data.id_ticket,
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
};*/

// Fecha todas as mensagens abertas de um ticket
const fecharTicket = async (id_ticket) => {
  const mensagens = await prisma.mensagemSuporte.findMany({
    where: { id_ticket: id_ticket, estado: "Aberto" },
  });

  if (!mensagens || mensagens.length === 0) {
    return { message: "Nenhuma mensagem aberta encontrada para este ticket." }; // Retorna uma mensagem amigável
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

// Listar todas as mensagens de um ticket, em ordem crescente
const listarMensagensDoTicket = async (id_ticket) => {
  const mensagens = await prisma.mensagemSuporte.findMany({
    where: { id_ticket: id_ticket },
    orderBy: { data_abertura: "asc" },
  });

  return mensagens || []; // Garantir que sempre retorna um array, mesmo que vazio
};

// Remover Ticket existente
const eliminarTicket = async (id_ticket) => {
  const result = await prisma.mensagemSuporte.deleteMany({
    where: { id_ticket: id_ticket },
  });

  return result; // Deve retornar o objeto resultante do deleteMany
};

const verificarTicketAberto = async (id_utilizador) => {
  const ticketAberto = await prisma.mensagemSuporte.findFirst({
    where: {
      id_utilizador: parseInt(id_utilizador),
      estado: "Aberto"
    },
    orderBy: { data_abertura: "desc" } // o mais recente, caso haja vários
  });

  if (!ticketAberto) return null;

  // Verifica se já há resposta do admin nesse ticket
  const respostaAdmin = await prisma.mensagemSuporte.findFirst({
    where: {
      id_ticket: ticketAberto.id_ticket,
      id_administrador: { not: null }, // resposta de admin
      data_abertura: { gt: ticketAberto.data_abertura } // após a criação do ticket
    },
    orderBy: { data_abertura: 'desc' }
  });



  return{
    ...ticketAberto,
    foiRespondido: !!respostaAdmin
  };
};

const listarTickets = async () => {
  // Pega os tickets únicos com dados agregados
  const tickets = await prisma.mensagemSuporte.groupBy({
    by: ['id_ticket'],
    _max: {
      data_abertura: true,
    },
    _min: {
      data_abertura: true,
    },
    _count: {
      id_ticket: true,
    },
    _max: {
      id: true
    },
    orderBy: {
      _max: {
        data_abertura: 'desc'
      }
    }
  });

  // Para cada ticket, busca a última mensagem para resumo (opcional)
  const ticketsComUltimaMensagem = await Promise.all(
    tickets.map(async (ticket) => {
      const ultimaMensagem = await prisma.mensagemSuporte.findFirst({
        where: { id_ticket: ticket.id_ticket },
        orderBy: { data_abertura: 'desc' },
      });

      const primeiraMensagemUtilizador = await prisma.mensagemSuporte.findFirst({
      where: {
        id_ticket: ticket.id_ticket,
        id_utilizador: { not: null },
      },
      orderBy: { data_abertura: 'asc' },
      include: { Utilizador: true },
    });

      return {
      id_ticket: ticket.id_ticket,
      totalMensagens: ticket._count.id_ticket,
      dataUltimaMensagem: ticket._max.data_abertura,
      estado: ultimaMensagem.estado,
      resumo: ultimaMensagem.mensagem.substring(0, 50),
      username: primeiraMensagemUtilizador?.Utilizador?.username || "Desconhecido",
      };
    })
  );

  return ticketsComUltimaMensagem;
};


const getTicketComMensagensParaUtilizador = async (id_utilizador) => {
  const ticketAberto = await prisma.mensagemSuporte.findFirst({
    where: {
      id_utilizador: parseInt(id_utilizador),
      estado: "Aberto"
    },
    orderBy: { data_abertura: "desc" }
  });

  if (!ticketAberto) return null;

  const mensagens = await prisma.mensagemSuporte.findMany({
    where: { id_ticket: ticketAberto.id_ticket },
    orderBy: { data_abertura: "asc" }
  });

  const foiRespondido = mensagens.some((msg) => msg.id_administrador !== null);

  return {
    id_ticket: ticketAberto.id_ticket,
    foiRespondido,
    mensagens
  };
};

module.exports = { 
    criarMensagemInicial, 
    //enviarResposta, 
    enviarRespostaUtilizador,
    enviarRespostaAdministrador,
    fecharTicket,
    listarMensagensDoTicket,
    eliminarTicket,
    verificarTicketAberto,
    listarTickets,
    getTicketComMensagensParaUtilizador
};
