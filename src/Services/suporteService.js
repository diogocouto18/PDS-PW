const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const criarArtigo = async (data) => {
    return await prisma.suporte.create({
        data: {
            artigo: data.artigo,
            descricao: data.descricao
        }
    });
};

const listarArtigos = async () => {
    return await prisma.suporte.findMany();
};

const obterArtigoPorId = async (id) => {
    return await prisma.suporte.findUnique({
        where: { id: parseInt(id) },
    });
};

const atualizarArtigo = async (id, data) => {
    return await prisma.suporte.update({
        where: { id: parseInt(id) },
        data: {
            artigo: data.artigo,
            descricao: data.descricao
        }
    });
};

const eliminarArtigo = async (id) => {
    return await prisma.suporte.delete({
        where: { id: parseInt(id) },
    });
};

module.exports = {
    criarArtigo, 
    listarArtigos, 
    obterArtigoPorId,
    atualizarArtigo,
    eliminarArtigo, 
};
