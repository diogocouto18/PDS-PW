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
      Utilizador: {
        connect: { id: data.id_utilizador }
      }
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

// Envia um resposta, mantendo o ticket aberto
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

// Fecha todas as mensagens abertas de um ticket
const fecharTicket = async (id_ticket) => {
  const mensagens = await prisma.mensagemSuporte.findMany({
    where: { id_ticket: parseInt(id_ticket), estado: "Aberto" },
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
    where: { id_ticket: parseInt(id_ticket) },
    orderBy: { data_abertura: "asc" },
  });

  return mensagens || []; // Garantir que sempre retorna um array, mesmo que vazio
};

// Remover Ticket existente
const eliminarTicket = async (id_ticket) => {
  const result = await prisma.mensagemSuporte.deleteMany({
    where: { id_ticket: parseInt(id_ticket) },
  });

  return result; // Deve retornar o objeto resultante do deleteMany
};

module.exports = { 
    criarMensagemInicial, 
    enviarResposta, 
    fecharTicket,
    listarMensagensDoTicket,
    eliminarTicket
};
