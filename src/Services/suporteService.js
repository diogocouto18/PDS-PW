const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Cria um novo artigo de Suporte
const criarArtigo = async (data) => {
    return await prisma.suporte.create({
        data: {
            artigo: data.artigo,
            descricao: data.descricao
        }
    });
};

// Lista todos os artigos de suporte
const listarArtigos = async () => {
    return await prisma.suporte.findMany();
};

// Obtem um artigo de suporte pelo o ID
const obterArtigoPorId = async (id) => {
    return await prisma.suporte.findUnique({
        where: { id: parseInt(id) },
    });
};

// Atualiza um artigo de suporte existente
const atualizarArtigo = async (id, data) => {
    return await prisma.suporte.update({
        where: { id: parseInt(id) },
        data: {
            artigo: data.artigo,
            descricao: data.descricao
        }
    });
};

// Remove um artigo de suporte
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
