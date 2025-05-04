const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const notificacaoService = require("./notificacaoService");

// Cria um novo anuncio para um evento
const criarAnuncio = async (data) => {
    const anuncio = await prisma.anuncio.create({
        data: {
            cargo: data.cargo,
            descricao: data.descricao,
            id_administrador: data.id_administrador,        
            id_evento: data.id_evento,
            estado: data.estado || "Ativo", 
        },
    });

    const utilizadores = await prisma.utilizador.findMany({ select: { id: true } });

    
    await Promise.all(utilizadores.map(({ id }) =>
      notificacaoService.criarNotificacao({
        id_utilizador: id,
        id_administrador: data.id_administrador,
        mensagem: `Novo anúncio publicado: ${data.cargo}`,
        estado: "Por_abrir",
      })
    ));
  
    return anuncio;
};


// Lista todos os anucios existentes por um evento
const listarAnuncios = async (id_evento) => {
    const whereClause = id_evento ? { id_evento: parseInt(id_evento) } : {};
    return await prisma.anuncio.findMany({
        where: whereClause,
        include: { Evento: true },
    });
};

// Obtem um anuncio existente por ID
const obterAnuncioPorId = async (id) => {
    return await prisma.anuncio.findUnique({
        where: { id: parseInt(id) },
        include: {Evento: true},
    });
};

// Atualiza o estado do anuncio existente
const encerrarAnuncio = async (id) => {
    const anuncio = await prisma.anuncio.findUnique({ where: { id: parseInt(id) } });
    if (anuncio.estado === "Terminado") {
        throw new Error("Anúncio já está encerrado");
    }

    return await prisma.anuncio.update({
        where: { id: parseInt(id) },
        data: { estado: "Terminado" },
    });
};

module.exports = {
    criarAnuncio,
    listarAnuncios,
    obterAnuncioPorId,
    encerrarAnuncio,
};