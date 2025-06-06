const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const notificacaoService = require("./notificacaoService");

// Processa a compra do nº de rifas: gera pagamento e marca rifas como compradas.
const comprarRifas = async (id_utilizador, id_sorteio, quantidadeCompra, metodo_pagamento) => {
  // 1. Seleciona rifas disponíveis
  const rifasDisponiveis = await prisma.rifa.findMany({
    where: {
      id_sorteio: id_sorteio,
      estado: "PorComprar",
    },
    take: quantidadeCompra,
  });

  if (rifasDisponiveis.length < quantidadeCompra) {
    throw new Error("Não há rifas suficientes disponíveis.");
  }

  // 2. Calcula o valor total
  const sorteio = await prisma.sorteioRifas.findUnique({
    where: { id: id_sorteio },
  });
  const valor_Total = sorteio.preco * quantidadeCompra;

  // 3. Cria pagamento
  const pagamento = await prisma.pagamento.create({
    data: {
      id_utilizador,
      id_sorteio,
      quantidadeCompra,
      valor_Total,
      metodo_pagamento,
      estado: "Pago",
    },
  });

  // 4. Atualizar o estado das rifas compradas
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

  // 5. Notificação para o utilizador confirmando pagamento
  await notificacaoService.criarNotificacao({
    id_utilizador,
    id_administrador: sorteio.id_administrador,
    mensagem: `Pagamento de ${quantidadeCompra} rifas no sorteio \"${sorteio.nome}\" concluído com sucesso.`,
    estado: "Por_abrir",
  });
  return pagamento;
};

module.exports = {
  comprarRifas
};