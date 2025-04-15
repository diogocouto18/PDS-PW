const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.criarAnuncio = async (data) => {
    // data = { cargo, descricao, id_administrador, id_evento, ... }
    return await prisma.anuncio.create({
        data: {
            cargo: data.cargo,
            descricao: data.descricao,
            id_administrador: data.id_administrador,
            id_evento: data.id_evento,
        },
    });
};

exports.listarAnuncios = async (id_evento) => {
    // Se vier id_evento, filtra
    const whereClause = id_evento ? { id_evento: parseInt(id_evento) } : {};
    return await prisma.anuncio.findMany({
        where: whereClause,
    });
};

exports.obterAnuncioPorId = async (id) => {
    return await prisma.anuncio.findUnique({
        where: { id: parseInt(id) },
    });
};
