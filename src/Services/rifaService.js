const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.criarRifa = async (data) => {
    // data: { nome, preco, quantidade, descricao, premio, data_sorteio, id_evento, id_administrador }
    return await prisma.rifa.create({
        data: {
            nome: data.nome,
            preco: data.preco,
            quantidade: data.quantidade,
            descricao: data.descricao,
            premio: data.premio,
            data_sorteio: new Date(data.data_sorteio),
            id_evento: parseInt(data.id_evento),
            id_administrador: parseInt(data.id_administrador),
            estado: "Ativa",
        },
    });
};

exports.listarRifas = async (id_evento) => {
    const whereClause = id_evento ? { id_evento: parseInt(id_evento) } : {};
    return await prisma.rifa.findMany({
        where: whereClause,
    });
};

exports.obterRifa = async (id) => {
    return await prisma.rifa.findUnique({
        where: { id: parseInt(id) },
    });
};