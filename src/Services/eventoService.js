const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const notificacaoService = require("../Services/notificacaoService");

// Cria um novo evento
const criarEvento = async (data) => {
    const evento = await prisma.evento.create({
        data: {
            titulo: data.titulo,
            localizacao: data.localizacao,
            descricao: data.descricao,
            data_evento: new Date(data.data_evento),            
            fotografia: data.fotografia,
            estado: "Ativo",
            id_administrador: data.id_administrador,
            id_categoria: data.id_categoria,
        },
    });

    const utilizadores = await prisma.utilizador.findMany({ select: { id: true } });

    await Promise.all(utilizadores.map(({ id }) =>
        notificacaoService.criarNotificacao({
            id_utilizador: id,
            id_administrador: data.id_administrador,
            mensagem: `Novo evento disponível: ${data.titulo}`,
            estado: "Por_abrir"
        })
    ));

    return evento;
};

// Lista todos os eventos existentes
const listarEventos = async () => {
    return await prisma.evento.findMany();
};

// Obtem um evento por ID
const obterEventoPorId = async (id) => {
    return await prisma.evento.findUnique({
        where: { id: parseInt(id) },
    });
};

// Atualiza um evento
const atualizarEvento = async (id, data) => {
    return await prisma.evento.update({
        where: { id: parseInt(id) },
        data
    });
};

// Remove um evento existente
const eliminarEvento = async (id) => {
    return await prisma.evento.delete({
        where: { id: parseInt(id) },
    });
};

module.exports = { 
    criarEvento,
    listarEventos,
    obterEventoPorId,
    atualizarEvento,
    eliminarEvento
};
