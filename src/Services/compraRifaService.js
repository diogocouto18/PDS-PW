const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.criarCompra = async (data) => {
    // Verificar se a rifa existe
    const rifa = await prisma.rifa.findUnique({
        where: { id: data.id_rifa },
    });

    if (!rifa) throw new Error("Rifa não encontrada!");

    // Verificar se há quantidade disponível
    if (rifa.quantidade < data.quantidade) {
        throw new Error("Quantidade de rifas insuficiente disponível!");
    }

    // Criar a compra
    const compra = await prisma.compraRifa.create({
        data: {
            id_utilizador: data.id_utilizador,
            id_rifa: data.id_rifa,
            quantidade: data.quantidade,
            estado: "Pendente", // Sempre começa como pendente até confirmar pagamento
        },
    });

    // Atualizar a quantidade disponível na rifa
    await prisma.rifa.update({
        where: { id: data.id_rifa },
        data: {
            quantidade: rifa.quantidade - data.quantidade,
        },
    });

    return compra;
};

exports.listarCompras = async () => {
    return await prisma.compraRifa.findMany();
};