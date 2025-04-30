const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Cria um novo evento
const criarEvento = async (data) => {
    return await prisma.evento.create({
        data: {
            titulo: data.titulo,
            localizacao: data.localizacao,
            descricao: data.descricao,
            data_evento: new Date(data.data_evento),            // Notificação que foi criado um evento
            fotografia: data.fotografia,
            estado: "Ativo",
            id_administrador: data.id_administrador,
            id_categoria: data.id_categoria,
        },
    });
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
}

// Remover Evento(Crud)

module.exports = { 
    criarEvento,
    listarEventos,
    obterEventoPorId,
    atualizarEvento,
};
