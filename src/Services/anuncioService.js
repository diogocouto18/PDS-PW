const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Cria um novo anuncio para um evento
const criarAnuncio = async (data) => {
    return await prisma.anuncio.create({
        data: {
            cargo: data.cargo,
            descricao: data.descricao,
            id_administrador: data.id_administrador,        // Notificação que foi criado um anuncio para um evento
            id_evento: data.id_evento,
            estado: data.estado || "Ativo", 
        },
    });
};

// Lista todos os anucios existentes por um evento
const listarAnuncios = async (id_evento) => {
    const whereClause = id_evento ? { id_evento: parseInt(id_evento) } : {};
    return await prisma.anuncio.findMany({
        where: whereClause,
        include: { Evento: true },
    });
};

// Obtem um anuncio existente por ID
const obterAnuncioPorId = async (id) => {
    return await prisma.anuncio.findUnique({
        where: { id: parseInt(id) },
        include: {Evento: true},
    });
};

// Atualiza o estado do anuncio existente
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