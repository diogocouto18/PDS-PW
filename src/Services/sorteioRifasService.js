const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Criar sorteio e gerar rifas
const criarSorteio = async (data) => {
    const sorteio = await prisma.sorteioRifas.create({
      data: {
        nome: data.nome,
        preco: parseFloat(data.preco),
        quantidade: data.quantidade,
        descricao: data.descricao,
        premio: data.premio,
        data_sorteio: new Date(data.data_sorteio),
        id_administrador: data.id_administrador,
        id_evento: data.id_evento,
      },
    });
  
    // Criar todas as rifas associadas
    const rifas = Array.from({ length: data.quantidade }).map(() => ({
      id_sorteio: sorteio.id,
      estado: "PorComprar",
    }));
  
    await prisma.rifa.createMany({
      data: rifas,
    });
  
    return sorteio;
  };
  
// Listar todos os sorteios
const listarSorteios = async () => {
    return await prisma.sorteioRifas.findMany({
      include: { Rifa: true }
    });
};
  
module.exports = { 
    criarSorteio, 
    listarSorteios 
};