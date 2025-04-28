const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Criar sorteio e gerar rifas
const criarSorteio = async (data) => {
  const sorteio = await prisma.sorteioRifas.create({
    data: {
      nome: data.nome,
      preco: parseFloat(data.preco),
      quantidadeTotal: parseInt(data.quantidadeTotal),
      descricao: data.descricao,
      premio: data.premio,
      data_sorteio: new Date(data.data_sorteio),
      id_administrador: parseInt(data.id_administrador),
      id_evento: parseInt(data.id_evento),
    },
  });
  
  // Criar todas as rifas associadas
  const rifas = Array.from({ length: data.quantidadeTotal }).map(() => ({
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
      include: { Rifa: true },
      orderBy: { data_sorteio: "asc" },
    });
};

const atualizarSorteio = async (id, data) => {
  return await prisma.sorteioRifas.update({
      where: { id: parseInt(id) },
      data,
  });
};

const eliminarSorteio = async (id) => {
  return await prisma.sorteioRifas.delete({
      where: { id: parseInt(id) },
  });
};
  
module.exports = { 
    criarSorteio, 
    listarSorteios,
    atualizarSorteio,
    eliminarSorteio 
};