const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.confirmarPagamento = async (idPagamento, novoEstado) => {
    if (!["Pago", "Falhado"].includes(novoEstado)) {
        throw new Error("Estado inválido. Só pode ser 'Pago' ou 'Falhado'.");
    }

    const pagamento = await prisma.pagamento.update({
        where: { id: parseInt(idPagamento) },
        data: {
            estado: novoEstado,
        },
    });

    return pagamento;
};