const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Lista todos os administradores existentes
const listarAdministradores = async () => {
    return await prisma.administrador.findMany();
};

// Obtem um administrador existente por um ID
const obterPorId = async (id) => {
    return await prisma.administrador.findUnique({
        where: { id: parseInt(id) },
    });
};

// Atualiza um administrador existente
const atualizarAdministradores = async (id, data) => {
    return await prisma.administrador.update({
        where: { id: parseInt(id) },
        data,
    });
};

// Remove um administrador existente
const eliminarAdministradores = async (id) => {
    return await prisma.administrador.delete({
        where: { id: parseInt(id) },
    });
};

module.exports = {
    listarAdministradores,
    obterPorId,
    atualizarAdministradores,
    eliminarAdministradores
}