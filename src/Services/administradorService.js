const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const criarAdministrador = async (data) => {
    return await prisma.administrador.create({ data });
};

const listarAdministradores = async () => {
    return await prisma.administrador.findMany();
};

const obterPorId = async (id) => {
    return await prisma.administrador.findUnique({
        where: { id: parseInt(id) },
    });
};

const atualizarAdministradores = async (id, data) => {
    return await prisma.administrador.update({
        where: { id: parseInt(id) },
        data,
    });
};

const eliminarAdministradores = async (id) => {
    return await prisma.administrador.delete({
        where: { id: parseInt(id) },
    });
};

module.exports = {
    criarAdministrador,
    listarAdministradores,
    obterPorId,
    atualizarAdministradores,
    eliminarAdministradores
}