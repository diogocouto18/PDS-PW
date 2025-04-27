const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const criarEvento = async (data) => {
    // Ex.: data = { titulo, localizacao, descricao, data_evento, fotografia, id_administrador, id_categoria, ... }
    return await prisma.evento.create({
        data: {
            titulo: data.titulo,
            localizacao: data.localizacao,
            descricao: data.descricao,
            data_evento: new Date(data.data_evento),
            fotografia: data.fotografia,
            estado: "Ativo", // se quiseres como default
            id_administrador: data.id_administrador,
            id_categoria: data.id_categoria,
        },
    });
};

const listarEventos = async () => {
    return await prisma.evento.findMany();
};

const obterEventoPorId = async (id) => {
    return await prisma.evento.findUnique({
        where: { id: parseInt(id) },
    });
};

const atualizarEvento = async (id, data) => {
    return await prisma.evento.update({
      where: { id: parseInt(id) },
      data
    });
  }

module.exports = { 
    criarEvento,
    listarEventos,
    obterEventoPorId,
    atualizarEvento,
};
