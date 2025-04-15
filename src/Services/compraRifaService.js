const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.criarCompra = async (data) => {
    // data: { id_utilizador, id_rifa, quantidade }
    // 1) Verifica se existe rifa e se está "Ativa"
    const rifa = await prisma.rifa.findUnique({
        where: { id: parseInt(data.id_rifa) },
    });
    if (!rifa) throw new Error("Rifa não encontrada");
    if (rifa.estado !== "Ativa") throw new Error("Rifa não está ativa");

    // 2) Verifica se existe quantidade suficiente
    if (data.quantidade > rifa.quantidade) {
        throw new Error("Quantidade solicitada excede a disponível");
    }

    // 3) Cria a compra com estado "Pendente"
    const compra = await prisma.compraRifa.create({
        data: {
            id_utilizador: parseInt(data.id_utilizador),
            id_rifa: parseInt(data.id_rifa),
            quantidade: parseInt(data.quantidade),
            estado: "Pendente",
        },
    });

    // 4) Atualiza a quantidade disponível da rifa
    await prisma.rifa.update({
        where: { id: parseInt(data.id_rifa) },
        data: {
            quantidade: rifa.quantidade - parseInt(data.quantidade),
        },
    });

    return compra;
};

exports.confirmarPagamento = async (id_compra, data) => {
    // data pode conter infos do pagamento se quiser
    const compra = await prisma.compraRifa.findUnique({
        where: { id: parseInt(id_compra) },
    });
    if (!compra) throw new Error("Compra não encontrada");
    if (compra.estado !== "Pendente") {
        throw new Error("O pagamento não pode ser confirmado pois não está pendente.");
    }

    // Atualiza para "Pago"
    const compraAtualizada = await prisma.compraRifa.update({
        where: { id: parseInt(id_compra) },
        data: {
            estado: "Pago",
            // se quiser salvar data_pagamento ou metodo de pagamento, etc
        },
    });
    return compraAtualizada;
};


// Realizar Sorteio
exports.sortearRifa = async (id) => {
    // Lógica simplificada:
    // 1. "Encerrar" a rifa (estado = "Encerrada")
    // 2. Escolher 1 ou mais vencedores aleatórios
    // 3. Atualizar estado das compras do(s) vencedor(es) p/ "Vencedor"
    // 4. Notificar
    const rifa = await prisma.rifa.findUnique({
        where: { id: parseInt(id) },
    });
    if (!rifa) {
        throw new Error("Rifa não encontrada");
    }
    if (rifa.estado === "Encerrada") {
        throw new Error("Rifa já foi sorteada/encerrada.");
    }

    // Marca como encerrada
    await prisma.rifa.update({
        where: { id: parseInt(id) },
        data: { estado: "Encerrada" },
    });

    // Buscar todas as compras da rifa
    const compras = await prisma.compraRifa.findMany({
        where: { id_rifa: parseInt(id), estado: "Pago" },
    });

    if (compras.length === 0) {
        return { message: "Nenhuma compra paga encontrada. Rifa encerrada sem vencedor." };
    }

    // Seleciona um index aleatório
    const randomIndex = Math.floor(Math.random() * compras.length);
    const vencedor = compras[randomIndex];

    // Marca o vencedor
    await prisma.compraRifa.update({
        where: { id: vencedor.id },
        data: { estado: "Vencedor" },
    });

    // Notifica (assumindo que tens uma tabela de notificacoes ou algo similar)
    await prisma.notificacao.create({
        data: {
            id_utilizador: vencedor.id_utilizador,
            id_administrador: rifa.id_administrador, // ou outro admin
            mensagem: `Você ganhou a rifa ${rifa.nome}! Resgate o prêmio: ${rifa.premio}`,
            estado: "Por abrir",
        },
    });

    return { message: `Vencedor da rifa: compra #${vencedor.id}. Utilizador ID: ${vencedor.id_utilizador}` };
};
