const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const notificacaoService = require("../Services/notificacaoService");

// Cria uma nova candidatura com estado "Pendente"
const criarCandidatura = async (data) => {
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
    return await prisma.candidaturaVoluntariado.create({
        data: {
            id_utilizador: parseInt(data.id_utilizador),
            id_anuncio: parseInt(data.id_anuncio),
            estado: "Pendente",
        },
    });
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
        data: {
            id_utilizador: candidatura.id_utilizador,
            id_administrador: idAdministrador,
            mensagem: novoEstado === "Aceite"
                ?"A sua candidatura foi aceite! Parabéns!"
                :"A sua candidatura foi rejeitada. Agradecemos o seu interesse.",
            estado: "Por_abrir"
        },
    });

    return candidatura;
};

// Lista todas as candidaturas existentes por um anuncio
const listarPorAnuncio = async (id_anuncio) => {
    return await prisma.candidaturaVoluntariado.findMany({
        where: { id_anuncio: parseInt(id_anuncio) },
        include: { Utilizador: true },
    });
};

module.exports= {
    criarCandidatura,
    avaliarCandidatura,
    listarPorAnuncio,
};