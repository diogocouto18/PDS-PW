const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const criarAnuncio = async (data) => {
    // data = { cargo, descricao, id_administrador, id_evento, ... }
    return await prisma.anuncio.create({
        data: {
            cargo: data.cargo,
            descricao: data.descricao,
            id_administrador: data.id_administrador,
            id_evento: data.id_evento,
            estado: data.estado || "Ativo", // se não for enviado, fica Ativo
        },
    });
};

const listarAnuncios = async (id_evento) => {
    // Se vier id_evento, filtra
    const whereClause = id_evento ? { id_evento: parseInt(id_evento) } : {};
    return await prisma.anuncio.findMany({
        where: whereClause,
        include: { Evento: true },
    });
};

const obterAnuncioPorId = async (id) => {
    return await prisma.anuncio.findUnique({
        where: { id: parseInt(id) },
        include: {Evento: true},
    });
};


const encerrarAnuncio = async (id) => {
    const anuncio = await prisma.anuncio.findUnique({ where: { id: parseInt(id) } });
    if (anuncio.estado === "Encerrado") {
      throw new Error("Anúncio já está encerrado");
    }

    return await prisma.anuncio.update({
      where: { id: parseInt(id) },
      data: { estado: "Encerrado" },
    });
  }


module.exports = {
    criarAnuncio,
    listarAnuncios,
    obterAnuncioPorId,
    encerrarAnuncio,
}