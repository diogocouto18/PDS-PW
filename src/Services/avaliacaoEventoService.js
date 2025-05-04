const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Adiciona uma avaliação a um evento
const criarAvaliacao= async (data) => {
  return await prisma.avaliacaoEvento.create({
    data: {
      id_utilizador: data.id_utilizador,
      id_evento: data.id_evento,
      nota: data.nota,
    },
  });
};

// Lista todas as avaliações por evento
const listarPorEvento= async (id_evento) => {
  return await prisma.avaliacaoEvento.findMany({
    where: { id_evento: parseInt(id_evento) },
    include: { Utilizador: true },
  });
};

// Atualiza a nota de avaliação de um evento
const atualizarAvaliacao= async (id_avaliacao, data) => {
  return await prisma.avaliacaoEvento.update({
    where: { id: parseInt(id_avaliacao) },
    data: { nota: data.nota },
  });
};

// Remove uma avaliação
const eliminarAvaliacao= async (id_avaliacao) => {
  return await prisma.avaliacaoEvento.delete({
    where: { id: parseInt(id_avaliacao) },
  });
};

// Calcula a média de avaliações de um evento
const mediaDoEvento= async (id_evento) => {
  const result = await prisma.avaliacaoEvento.aggregate({
    _avg: { nota: true },
    where: { id_evento: parseInt(id_evento) },
  });
  return result._avg.nota;
};

module.exports = {
  criarAvaliacao,
  listarPorEvento,
  atualizarAvaliacao,
  eliminarAvaliacao,
  mediaDoEvento,
};