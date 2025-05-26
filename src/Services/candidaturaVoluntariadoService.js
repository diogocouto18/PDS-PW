const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const notificacaoService = require("../Services/notificacaoService");

// Cria uma nova candidatura com estado "Pendente"
const criarCandidatura = async (data) => {
    
    const anuncioExiste = await prisma.anuncio.findUnique({
        where: { id: parseInt(data.id_anuncio) },
        select: { id: true }
    });
    if (!anuncioExiste) {
        throw new Error("Anúncio não encontrado.");
    }
    
    const candidaturaExistente = await prisma.candidaturaVoluntariado.findFirst({
        where: {
            id_utilizador: parseInt(data.id_utilizador),
            id_anuncio: parseInt(data.id_anuncio),
            estado: "Pendente"    
        }
    });
    if (candidaturaExistente) {
        throw new Error("Já existe uma candidatura pendente para este anúncio.");
    }

    const candidatura = await prisma.candidaturaVoluntariado.create({
        data: {
            id_utilizador: parseInt(data.id_utilizador),
            id_anuncio: parseInt(data.id_anuncio),
            estado: "Pendente",
            mensagem: data.mensagem || null,
        },
    }); 
    
    const anuncio = await prisma.anuncio.findUnique({
        where: { id: parseInt(data.id_anuncio) },
        select: { id_administrador: true, cargo: true },
    });

    await notificacaoService.criarNotificacao({
        id_administrador: anuncio.id_administrador,
        mensagem: `Nova candidatura para "${anuncio.cargo}"`,
        estado: "Por_abrir",
    });

    return candidatura;
};

// Avalia uma candidatura existente para um anuncio, alterando o seu estado
const avaliarCandidatura = async (id, novoEstado, idAdministrador) => {
    
    if (!["Aceite", "Rejeitado"].includes(novoEstado)) {
        throw new Error("Estado inválido. Use 'Aceite' ou 'Rejeitado'.");
    }
    const candidatura = await prisma.candidaturaVoluntariado.update({
        where: { id: parseInt(id) },
        data: { estado: novoEstado },
    });

    await notificacaoService.criarNotificacao({
        id_utilizador: candidatura.id_utilizador,
        mensagem: novoEstado === "Aceite"
            ?"A sua candidatura foi aceite! Parabéns!"
            :"A sua candidatura foi rejeitada. Agradecemos o seu interesse.",
        estado: "Por_abrir"
    });

    return candidatura;             
};

// Lista todas as candidaturas existentes por um anuncio
const listarPorAnuncio = async (id_anuncio) => {
    return await prisma.candidaturaVoluntariado.findMany({
        where: { id_anuncio: parseInt(id_anuncio) },
        include: { Utilizador: true, Anuncio: { include: { Evento: true }}},
    });
};

// Listar candidaturas feitas pelo utilizador autenticado
const listarMinhasCandidaturas = async (id_utilizador) => {
    return await prisma.candidaturaVoluntariado.findMany({
      where: { id_utilizador },
        include: { 
            Anuncio: {
                include: {
                Evento: true
                },
            }       
        }
    });
}


// Remove uma candidatura existente 
const removerCandidatura = async (id) => {
    return await prisma.candidaturaVoluntariado.delete({ 
        where: { id: parseInt(id) }, 
    });
};


module.exports= {
    criarCandidatura,
    avaliarCandidatura,
    listarPorAnuncio,
    listarMinhasCandidaturas,
    removerCandidatura,
};