const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const enviarMensagem = async (ticketId, data) => {
    // data deve conter: { id_utilizador, id_administrador, mensagem }
    // Verifica se o ticket existe
    const ticket = await prisma.suporte.findUnique({
        where: { id: parseInt(ticketId) },
    });
    if (!ticket) {
        throw new Error("Ticket não encontrado");
    }

    // (Opcional) Verifique se o ticket está aberto, se houver campo de estado.
    // Por exemplo: if (ticket.estado !== "Aberto") throw new Error("Ticket não está aberto para novas mensagens");

    return await prisma.mensagemSuporte.create({
        data: {
            id_suporte: parseInt(ticketId),
            id_utilizador: data.id_utilizador ? parseInt(data.id_utilizador) : null,
            id_administrador: data.id_administrador ? parseInt(data.id_administrador) : null,
            mensagem: data.mensagem,
            data_abertura: new Date(),
            // data_encerramento, se aplicável, pode ser null ou definido conforme lógica
        },
    });
};

module.exports = { enviarMensagem };
