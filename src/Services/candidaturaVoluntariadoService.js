const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Cria candidatura com estado Pendente
exports.criarCandidatura = async (data) => {
    // data: { id_utilizador, id_anuncio }
    // Verifica se já existe candidatura aberta para esse user/anuncio
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

exports.listarCandidaturas = async () => {
    // Pode filtrar por estado ou id_anuncio se quiser
    return await prisma.candidaturaVoluntariado.findMany();
};

exports.obterCandidatura = async (id) => {
    return await prisma.candidaturaVoluntariado.findUnique({
        where: { id: parseInt(id) },
    });
};

exports.avaliarCandidatura = async (id, novoEstado) => {
    // novoEstado deve ser "Aceite" ou "Rejeitado"
    if (!["Aceite", "Rejeitado"].includes(novoEstado)) {
        throw new Error("Estado inválido. Use 'Aceite' ou 'Rejeitado'.");
    }
    return await prisma.candidaturaVoluntariado.update({
        where: { id: parseInt(id) },
        data: {
            estado: novoEstado,
        },
    });
};

exports.avaliarCandidatura = async (id, novoEstado) => {
    if (!["Aceite", "Rejeitado"].includes(novoEstado)) {
        throw new Error("Estado inválido. Use 'Aceite' ou 'Rejeitado'.");
    }
    const candidatura = await prisma.candidaturaVoluntariado.update({
        where: { id: parseInt(id) },
        data: { estado: novoEstado },
    });

    if (novoEstado === "Aceite") {
        // Cria notificação
        await prisma.notificacao.create({
            data: {
                id_utilizador: candidatura.id_utilizador,
                id_administrador: 1, // ou o admin que avaliou
                mensagem: "A sua candidatura foi aceite! Parabéns!",
                estado: "Por_abrir"
            },
        });
    }

    return candidatura;
};
