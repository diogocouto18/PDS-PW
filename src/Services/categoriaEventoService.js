const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const obterTodos = async () => {
    return await prisma.categoriaEvento.findMany();
};

const obterPorId = async (id) => {
    return await prisma.categoriaEvento.findUnique({
        where: { id: parseInt(id) },
    });
};

const criar = async (data) => {
    // data: { nome }
    return await prisma.categoriaEvento.create({
        data: {
            nome: data.nome,
        },
    });
};

const atualizar = async (id, data) => {
    return await prisma.categoriaEvento.update({
        where: { id: parseInt(id) },
        data,
    });
};

const deletar = async (id) => {
    return await prisma.categoriaEvento.delete({
        where: { id: parseInt(id) },
    });
};

module.exports = {
    obterTodos,
    obterPorId,
    criar,
    atualizar,
    deletar,
};