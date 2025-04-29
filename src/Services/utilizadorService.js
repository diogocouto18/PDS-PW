const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/*const criarUtilizador = async (data) => {
    return await prisma.utilizador.create({ data });
};*/

// Retorna todos os utilizadores
const listarUtilizadores = async () => {
    return await prisma.utilizador.findMany();
};

// Obtem um utilizador pelo seu ID
const obterPorId = async (id) => {
    return await prisma.utilizador.findUnique({
        where: { id: parseInt(id) },
    });
};

// Atualiza os dados de um utilizador existente
const atualizarUtilizadores = async (id, data) => {
    return await prisma.utilizador.update({
        where: { id: parseInt(id) },
        data,
    });
};

// Remove um utilizador
const eliminarUtilizadores = async (id) => {
    return await prisma.utilizador.delete({
        where: { id: parseInt(id) },
    });
};

module.exports = {
    //criarUtilizador,
    listarUtilizadores,
    obterPorId,
    atualizarUtilizadores,
    eliminarUtilizadores,
};
