const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Cria um nova categoria
const criar = async (data) => {
    return await prisma.categoriaEvento.create({
        data: {
            nome: data.nome
        },
    });
};

// Lista todas as categorias existentes
const obterTodos = async () => {
    return await prisma.categoriaEvento.findMany();
};

// Obtem uma categoria por um ID
const obterPorId = async (id) => {
    return await prisma.categoriaEvento.findUnique({
        where: { id: parseInt(id) },
    });
};

// Atualiza uma categoria
const atualizar = async (id, data) => {
    return await prisma.categoriaEvento.update({
        where: { id: parseInt(id) },
        data: { nome: data.nome },
    });
};

// Remove uma categoria
const eliminar = async (id) => {
    return await prisma.categoriaEvento.delete({
        where: { id: parseInt(id) },
    });
};


module.exports = {
    obterTodos,
    obterPorId,
    criar,
    atualizar,
    eliminar,
};