const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todas as rifas de um sorteio
const listarRifasPorSorteio = async (id_sorteio) => {
    return await prisma.rifa.findMany({
        where: { id_sorteio: parseInt(id_sorteio) },
        include: {
            Utilizador: true,
            SorteioRifas: true,
        },
        orderBy: { id: "asc" },
    });
};

// Atualiza o estado de uma rifa (ex: Comprada, Vencedor, Perdedor, SegundoLugar, TerceiroLugar)
const atualizarEstadoRifa = async (id_rifa, estado) => {
    const estadosValidos = ["Vencedor","SegundoLugar","TerceiroLugar","Perdedor","PorComprar","Comprada"];
    if (!estadosValidos.includes(estado)) {
        throw new Error(`Estado inválido. Use um dos: ${estadosValidos.join(", ")}`);
    }
    return await prisma.rifa.update({
        where: { id: parseInt(id_rifa) },
        data: { estado },
    });
};

// Obter detalhes de uma rifa
const obterRifaPorId = async (id_rifa) => {
    return await prisma.rifa.findUnique({
        where: { id: parseInt(id_rifa) },
        include: {
            Utilizador: true,
            SorteioRifas: true,
        },
    });
};

module.exports = {
    listarRifasPorSorteio,
    atualizarEstadoRifa,
    obterRifaPorId,
};