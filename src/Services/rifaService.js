const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.criar = async (data) => {
    return await prisma.rifa.create({
        data: {
            nome: data.nome,
            preco: data.preco,
            quantidade: data.quantidade,
            descricao: data.descricao,
            premio: data.premio,
            data_sorteio: new Date(data.data_sorteio),
            id_administrador: parseInt(data.id_administrador),
            id_evento: parseInt(data.id_evento),
        },
    });
};

exports.listar = async () => {
    return await prisma.rifa.findMany();
};

exports.obterPorId = async (id) => {
    return await prisma.rifa.findUnique({
        where: { id: parseInt(id) },
    });
};

exports.atualizar = async (id, data) => {
    return await prisma.rifa.update({
        where: { id: parseInt(id) },
        data,
    });
};

exports.deletar = async (id) => {
    return await prisma.rifa.delete({
        where: { id: parseInt(id) },
    });
};

exports.sortearRifa = async (idRifa, idAdministrador) => {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    // Buscar todas as compras pagas para a rifa
    const comprasPagas = await prisma.compraRifa.findMany({
        where: {
            id_rifa: parseInt(idRifa),
            estado: "Pago",
        },
    });

    if (comprasPagas.length === 0) {
        throw new Error("Nenhuma compra paga encontrada para esta rifa.");
    }

    // Escolher um vencedor aleatório
    const vencedor = comprasPagas[Math.floor(Math.random() * comprasPagas.length)];

    // Atualizar o estado do vencedor
    await prisma.compraRifa.update({
        where: { id: vencedor.id },
        data: { estado: "Vencedor" },
    });

    // Atualizar o estado dos restantes como Perdedor
    const perdedores = comprasPagas.filter(c => c.id !== vencedor.id);
    for (const perdedor of perdedores) {
        await prisma.compraRifa.update({
            where: { id: perdedor.id },
            data: { estado: "Perdedor" },
        });
    }

    // Criar uma notificação para o vencedor
    await prisma.notificacao.create({
        data: {
            id_utilizador: vencedor.id_utilizador,
            id_administrador: idAdministrador, // O admin que realizou o sorteio
            mensagem: `Parabéns! Você venceu a rifa #${idRifa}! 🎉`,
            estado: "Por abrir",
        },
    });

    return { message: `Sorteio realizado com sucesso para a rifa ${idRifa}.` };
};