const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.criarEvento = async (data) => {
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

exports.listarEventos = async () => {
    return await prisma.evento.findMany();
};

exports.obterEventoPorId = async (id) => {
    return await prisma.evento.findUnique({
        where: { id: parseInt(id) },
    });
};
