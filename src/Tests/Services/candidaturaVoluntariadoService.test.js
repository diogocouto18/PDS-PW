const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const candidaturaVoluntariadoService = require('../../Services/candidaturaVoluntariadoService');
const notificacaoService = require('../../Services/notificacaoService');

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
    const mCandidaturaVoluntariado = {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mAnuncio = {
        findUnique: jest.fn(),
    };

    const mPrismaClient = {
        candidaturaVoluntariado: mCandidaturaVoluntariado,
        anuncio: mAnuncio,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

// Mock do notificacaoService
jest.mock('../../Services/notificacaoService', () => ({
    criarNotificacao: jest.fn(),
}));

describe('CandidaturaVoluntariado Service', () => {
    const mockData = {
        id_utilizador: 1,
        id_anuncio: 2,
    };

    const mockCandidatura = {
        id: 1,
        id_utilizador: 1,
        id_anuncio: 2,
        estado: "Pendente",
    };

    const mockAnuncio = {
        id_administrador: 1,
        cargo: 'Desenvolvedor',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('criarCandidatura deve criar uma nova candidatura e notificar', async () => {
        prisma.anuncio.findUnique.mockResolvedValue(mockAnuncio);
        prisma.candidaturaVoluntariado.findFirst.mockResolvedValue(null);
        prisma.candidaturaVoluntariado.create.mockResolvedValue(mockCandidatura);

        const candidatura = await candidaturaVoluntariadoService.criarCandidatura(mockData);

        expect(candidatura).toEqual(mockCandidatura);
        expect(prisma.candidaturaVoluntariado.create).toHaveBeenCalledWith({
            data: {
                id_utilizador: mockData.id_utilizador,
                id_anuncio: mockData.id_anuncio,
                estado: "Pendente",
            },
        });

        // Verificar notificação
        expect(notificacaoService.criarNotificacao).toHaveBeenCalledWith({
            id_utilizador: mockCandidatura.id_utilizador,
            id_administrador: mockAnuncio.id_administrador,
            mensagem: `Nova candidatura para "${mockAnuncio.cargo}"`,
            estado: "Por_abrir",
        });
    });

    test('criarCandidatura deve lançar erro se o anúncio não for encontrado', async () => {
        prisma.anuncio.findUnique.mockResolvedValue(null); // Anúncio não encontrado

        await expect(candidaturaVoluntariadoService.criarCandidatura(mockData))
            .rejects
            .toThrow("Anúncio não encontrado.");
    });

    test('criarCandidatura deve lançar erro se já existir uma candidatura pendente', async () => {
        prisma.anuncio.findUnique.mockResolvedValue(mockAnuncio);
        prisma.candidaturaVoluntariado.findFirst.mockResolvedValue(mockCandidatura); // Candidatura já existente

        await expect(candidaturaVoluntariadoService.criarCandidatura(mockData))
            .rejects
            .toThrow("Já existe uma candidatura pendente para este anúncio.");
    });

    test('avaliarCandidatura deve atualizar o estado da candidatura e notificar', async () => {
        const novoEstado = "Aceite";

        // Mock da atualização da candidatura
        prisma.candidaturaVoluntariado.update.mockResolvedValue({
            ...mockCandidatura,
            estado: novoEstado,
        });

        // Executa o serviço
        const candidaturaAtualizada = await candidaturaVoluntariadoService.avaliarCandidatura(mockCandidatura.id, novoEstado, 1);

        // Verifica se o estado foi atualizado corretamente
        expect(candidaturaAtualizada.estado).toBe(novoEstado);

        // Verifica se a função update foi chamada com os parâmetros corretos
        expect(prisma.candidaturaVoluntariado.update).toHaveBeenCalledWith({
            where: { id: mockCandidatura.id },
            data: { estado: novoEstado },
        });

        // Verifica se a notificação foi criada corretamente
        expect(notificacaoService.criarNotificacao).toHaveBeenCalledWith({
            id_utilizador: mockCandidatura.id_utilizador,
            id_administrador: 1,
            mensagem: "A sua candidatura foi aceite! Parabéns!",
            estado: "Por_abrir",
        });
    });

    test('avaliarCandidatura deve lançar erro se o estado for inválido', async () => {
        await expect(candidaturaVoluntariadoService.avaliarCandidatura(mockCandidatura.id, "Invalido", 1))
            .rejects
            .toThrow("Estado inválido. Use 'Aceite' ou 'Rejeitado'.");
    });

    test('listarPorAnuncio deve retornar todas as candidaturas de um anúncio', async () => {
        prisma.candidaturaVoluntariado.findMany.mockResolvedValue([mockCandidatura]);

        const candidaturas = await candidaturaVoluntariadoService.listarPorAnuncio(mockData.id_anuncio);

        expect(Array.isArray(candidaturas)).toBe(true);
        expect(candidaturas.length).toBeGreaterThan(0);
        expect(candidaturas[0]).toEqual(mockCandidatura);
    });

    test('removerCandidatura deve remover uma candidatura', async () => {
        prisma.candidaturaVoluntariado.delete.mockResolvedValue(mockCandidatura);

        const candidaturaRemovida = await candidaturaVoluntariadoService.removerCandidatura(mockCandidatura.id);

        expect(candidaturaRemovida).toEqual(mockCandidatura);
        expect(prisma.candidaturaVoluntariado.delete).toHaveBeenCalledWith({
            where: { id: mockCandidatura.id },
        });
    });
});