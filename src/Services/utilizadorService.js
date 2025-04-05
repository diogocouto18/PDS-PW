const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.obterTodos = async () => {
    return await prisma.utilizador.findMany();
};

exports.obterPorId = async (id) => {
    return await prisma.utilizador.findUnique({
        where: { id: parseInt(id) },
    });
};

exports.criar = async (data) => {
    return await prisma.utilizador.create({ data });
};

exports.atualizar = async (id, data) => {
    return await prisma.utilizador.update({
        where: { id: parseInt(id) },
        data,
    });
};

exports.deletar = async (id) => {
    return await prisma.utilizador.delete({
        where: { id: parseInt(id) },
    });
};
