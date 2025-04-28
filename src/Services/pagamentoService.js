const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Comprar rifas e criar pagamento
const comprarRifas = async (id_utilizador, id_sorteioRifas, quantidade, metodo_pagamento) => {
    // Buscar rifas livres
    const rifasDisponiveis = await prisma.rifa.findMany({
      where: {
        id_sorteio: id_sorteioRifas,
        estado: "PorComprar",
      },
      take: quantidade,
    });
  
    if (rifasDisponiveis.length < quantidade) {
      throw new Error("Não há rifas suficientes disponíveis.");
    }
  
    // Calcular valor total
    const sorteio = await prisma.sorteioRifas.findUnique({
      where: { id: id_sorteioRifas },
    });
  
    const valorTotal = sorteio.preco * quantidade;
  
    // Criar pagamento
    const pagamento = await prisma.pagamento.create({
      data: {
        id_utilizador,
        id_sorteioRifas,
        quantidade,
        valorTotal,
        metodo_pagamento,
        estado: "Pago", // Para simplificação aqui
      },
    });
  
    // Atualizar rifas compradas
    await Promise.all(
      rifasDisponiveis.map((rifa) =>
        prisma.rifa.update({
          where: { id: rifa.id },
          data: {
            id_utilizador,
            estado: "Comprada",
          },
        })
      )
    );
  
    return pagamento;
  };
  
module.exports = { comprarRifas };