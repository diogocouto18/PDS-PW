const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.obterTodos = async () => {
    return await prisma.administrador.findMany();
};

exports.obterPorId = async (id) => {
    return await prisma.administrador.findUnique({
        where: { id: parseInt(id) },
    });
};

exports.criar = async (data) => {
    return await prisma.administrador.create({ data });
};

exports.atualizar = async (id, data) => {
    return await prisma.administrador.update({
        where: { id: parseInt(id) },
        data,
    });
};

exports.deletar = async (id) => {
    return await prisma.administrador.delete({
        where: { id: parseInt(id) },
    });
};
