const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const notificacaoService = require("./notificacaoService");

// Cria um sorteio e gera automaticamente as rifas em estado "PorComprar"
const criarSorteio = async (data) => {
  // 1. Cria o registro do sorteio
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

  // 2. Prepara array de rifas “PorComprar” com base na quantidadeTotal
  const rifas = Array.from({ length: data.quantidadeTotal }).map(() => ({
    id_sorteio: sorteio.id,
    estado: "PorComprar",
  }));

  // 3. Cria todas as rifas
  await prisma.rifa.createMany({
    data: rifas,
  });

  // 4. Notificação de novo sorteio para todos os utilizadores
  const utilizadores = await prisma.utilizador.findMany({ select: { id: true } });
  if (Array.isArray(utilizadores)) {
    await Promise.all(utilizadores.map(({ id }) =>
        notificacaoService.criarNotificacao({
          id_utilizador: id,
          id_administrador: sorteio.id_administrador,
          mensagem: `Novo sorteio de rifas "${sorteio.nome}" agendado para ${sorteio.data_sorteio.toLocaleString()}.`,
          estado: "Por_abrir",
        })
    ));
  }

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


// Sorteio do Vencedor
const sortearVencedor = async (id_sorteio) => {
  const rifasCompradas = await prisma.rifa.findMany({
    where: {
      id_sorteio: parseInt(id_sorteio),
      estado: "Comprada",
    },
  });
  if (!rifasCompradas.length) {
    throw new Error("Não existem rifas compradas para este sorteio.");
  }

  const sortearIndex = Math.floor(Math.random() * rifasCompradas.length);
  const RifaSorteada = rifasCompradas[sortearIndex];

  const atualizarVencedor = await prisma.rifa.update({
    where: { id: RifaSorteada.id },
    data: { estado: "Vencedor" },
  });

  await notificacaoService.criarNotificacao({
    id_utilizador: atualizarVencedor.id_utilizador,
    id_administrador: atualizarVencedor.id_sorteio,
    mensagem: `Parabéns! A rifa ${atualizarVencedor.id} foi sorteada como vencedora no sorteio ${id_sorteio}. O código para levantar o seu prémio é 2543`,
    estado: "Por_abrir",
  });

  return atualizarVencedor;
};

// Sorteio do segundo lugar
const sortearSegundoLugar = async (id_sorteio) => {
  const rifasCompradas = await prisma.rifa.findMany({
    where: {
      id_sorteio: parseInt(id_sorteio),
      estado: "Comprada",
    },
  });
  if (!rifasCompradas.length) {
    throw new Error("Não existem rifas compradas para este sorteio.");
  }

  const sortearIndex = Math.floor(Math.random() * rifasCompradas.length);
  const RifaSorteada = rifasCompradas[sortearIndex];

  const atualizarVencedor = await prisma.rifa.update({
    where: { id: RifaSorteada.id },
    data: { estado: "SegundoLugar" },
  });

  await notificacaoService.criarNotificacao({
    id_utilizador: atualizarVencedor.id_utilizador,
    id_administrador: atualizarVencedor.id_sorteio,
    mensagem: `Parabéns! A rifa ${atualizarVencedor.id} foi sorteada como segundo lugar no sorteio ${id_sorteio}. O código para levantar o seu prémio é 5467`,
    estado: "Por_abrir",
  });
  return atualizarVencedor;
};

// Sorteio do terceiro lugar
const sortearTerceiroLugar = async (id_sorteio) => {
  const rifasCompradas = await prisma.rifa.findMany({
    where: {
      id_sorteio: parseInt(id_sorteio),
      estado: "Comprada",
    },
  });
  if (!rifasCompradas.length) {
    throw new Error("Não existem rifas compradas para este sorteio.");
  }

  const sortearIndex = Math.floor(Math.random() * rifasCompradas.length);
  const RifaSorteada = rifasCompradas[sortearIndex];

  const atualizarVencedor = await prisma.rifa.update({
    where: { id: RifaSorteada.id },
    data: { estado: "TerceiroLugar" },
  });

  await notificacaoService.criarNotificacao({
    id_utilizador: atualizarVencedor.id_utilizador,
    id_administrador: atualizarVencedor.id_sorteio,
    mensagem: `Parabéns! A rifa ${atualizarVencedor.id} foi sorteada como terceiro lugar no sorteio ${id_sorteio}. O código para levantar o seu prémio é 8659`,
    estado: "Por_abrir",
  });
  return atualizarVencedor;
};

module.exports = {
  criarSorteio,
  listarSorteios,
  atualizarSorteio,
  eliminarSorteio,
  sortearVencedor,
  sortearSegundoLugar,
  sortearTerceiroLugar
};