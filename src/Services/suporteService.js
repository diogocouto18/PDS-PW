const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const criarTicket = async (data) => {
    // data: { artigo, descricao, id_utilizador }
    return await prisma.suporte.create({
        data: {
            artigo: data.artigo,
            descricao: data.descricao,
            utilizador: data.utilizador,
        },
    });
};

const obterTicketPorId = async (id) => {
    return await prisma.suporte.findUnique({
        where: { id: parseInt(id) },
        include: { mensagens: true }, // Inclui as mensagens associadas ao ticket
    });
};

const resolverTicket = async (id) => {
    // Se desejar implementar um estado de resolução, seria necessário incluir campos "estado" e "dataEncerramento" no modelo Suporte.
    // Como o modelo atual não os possui, aqui apenas retornamos uma mensagem.
    return { message: "Ticket marcado como resolvido (implemente campos de estado se necessário)" };
};

module.exports = { criarTicket, obterTicketPorId, resolverTicket };
