const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const criarAvaliacao= async (data) => {
  return await prisma.avaliacaoEvento.create({
    data: {
      id_utilizador: data.id_utilizador,
      id_evento: data.id_evento,
      nota: data.nota,
    },
  });
}

const listarPorEvento= async (id_evento) => {
  return await prisma.avaliacaoEvento.findMany({
    where: { id_evento: parseInt(id_evento) },
    include: { Utilizador: true },
  });
}

const atualizarAvaliacao= async (id_avaliacao, data) => {
  return await prisma.avaliacaoEvento.update({
    where: { id: parseInt(id_avaliacao) },
    data: { nota: data.nota },
  });
}


const eliminarAvaliacao= async (id_avaliacao) => {
  return await prisma.avaliacaoEvento.delete({
    where: { id: parseInt(id_avaliacao) },
  });
}

const mediaDoEvento= async (id_evento) => {
  const result = await prisma.avaliacaoEvento.aggregate({
    _avg: { nota: true },
    where: { id_evento: parseInt(id_evento) },
  });
  return result._avg.nota;
}

const obterPorId= async (id_avaliacao) => {
    return await prisma.avaliacaoEvento.findUnique({
        where: { id: parseInt(id_avaliacao) },
      });
}

module.exports = {
  criarAvaliacao,
  listarPorEvento,
  atualizarAvaliacao,
  eliminarAvaliacao,
  mediaDoEvento,
  obterPorId,
};