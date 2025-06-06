const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Criar uma nova notificação
const criarNotificacao = async (data) => {
  return await prisma.notificacao.create({
    data: {
      id_utilizador: data.id_utilizador,
      id_administrador: data.id_administrador,
      mensagem: data.mensagem,
      estado: "Por_abrir",
    },
  });
};

// Listar todas as notificações de um utilizador
const listarNotificacoesPorUtilizador = async (id_utilizador) => {
  return await prisma.notificacao.findMany({
    where: { id_utilizador: parseInt(id_utilizador) },
    orderBy: { data_envio: "desc" },
  });
};

// Listar notificações de um administrador
const listarNotificacoesPorAdministrador = async (id_administrador) => {
  return await prisma.notificacao.findMany({
    where: { id_administrador: parseInt(id_administrador) },
    orderBy: { data_envio: "desc" },
  });
};

// Atualiza o estado de uma notificação para "Aberto"
const abrirNotificacao = async (id) => {
  return await prisma.notificacao.update({          
    where: { id: parseInt(id) },
    data: { estado: "Aberto" },
  });
};

// Remove uma notificação
const apagarNotificacao = async (id) => {
  return await prisma.notificacao.delete({
    where: { id: parseInt(id) },
  });
};

// Conta notificações "Por_abrir" de um utilizador
const contarNotificacoesUtilizador = async (id_utilizador) => {
  return await prisma.notificacao.count({
    where: {
      id_utilizador: parseInt(id_utilizador),
      estado: 'Por_abrir',
    },
  });
};

// Conta notificações "Por_abrir" de um administrador
const contarNotificacoesAdministrador = async (id_administrador) => {
  return await prisma.notificacao.count({
    where: {
      id_administrador: parseInt(id_administrador),
      estado: 'Por_abrir',
    },
  });
};

module.exports = {
  criarNotificacao,
  listarNotificacoesPorUtilizador,
  listarNotificacoesPorAdministrador,
  abrirNotificacao,
  apagarNotificacao,
  contarNotificacoesUtilizador,
  contarNotificacoesAdministrador,
};
