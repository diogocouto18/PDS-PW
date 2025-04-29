const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Cria um sorteio e gera automaticamente as rifas em estado "PorComprar"
const criarSorteio = async (data) => {
  //1. Cria o registro do sorteio
  const sorteio = await prisma.sorteioRifas.create({
    data: {
      nome: data.nome,
      preco: parseFloat(data.preco),
      quantidadeTotal: parseInt(data.quantidadeTotal),
      descricao: data.descricao,                                                  // Notificação que foi criado um sorteio de rifas
      premio: data.premio,
      data_sorteio: new Date(data.data_sorteio),
      id_administrador: parseInt(data.id_administrador),
      id_evento: parseInt(data.id_evento),
    },
  });
  
  // 2. Prepara array de rifas “PorComprar” com base na quantidadeTotal
  const rifas = Array.from({ length: data.quantidadeTotal }).map(() => ({
    id_sorteio: sorteio.id,
    estado: "PorComprar",
  }));
  
  // 3. Cria todas as rifas
  await prisma.rifa.createMany({
    data: rifas,
  });
  
  return sorteio;
};
  
// Listar todos os sorteios, incluindo as rifas geradas
const listarSorteios = async () => {
  return await prisma.sorteioRifas.findMany({
    include: { Rifa: true },
    orderBy: { data_sorteio: "asc" },
  });
};

// Atualiza os dados de um sorteio
const atualizarSorteio = async (id, data) => {
  return await prisma.sorteioRifas.update({
    where: { id: parseInt(id) },
    data,
  });
};

// Remove um sorteio e todas as rifas associadas
const eliminarSorteio = async (id) => {
  return await prisma.sorteioRifas.delete({
    where: { id: parseInt(id) },
  });
};      
                                                      // Função de sortear uma rifa para o sorteio com o estado "Comprada"
module.exports = { 
    criarSorteio, 
    listarSorteios,
    atualizarSorteio,
    eliminarSorteio 
};