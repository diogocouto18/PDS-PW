const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const criarUtilizador = async (data) => {
    return await prisma.utilizador.create({ data });
};

const listarUtilizadores = async () => {
    return await prisma.utilizador.findMany();
};

const obterPorId = async (id) => {
    return await prisma.utilizador.findUnique({
        where: { id: parseInt(id) },
    });
};

const atualizarUtilizadores = async (id, data) => {
    return await prisma.utilizador.update({
        where: { id: parseInt(id) },
        data,
    });
};

const eliminarUtilizadores = async (id) => {
    return await prisma.utilizador.delete({
        where: { id: parseInt(id) },
    });
};

module.exports = {
    criarUtilizador,
    listarUtilizadores,
    obterPorId,
    atualizarUtilizadores,
    eliminarUtilizadores,
}
