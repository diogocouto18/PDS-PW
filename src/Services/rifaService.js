const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar rifas de um sorteio
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

// Atualizar estado de uma rifa (Vencedor, Perdedor, etc)
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