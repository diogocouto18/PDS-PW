// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa o serviço de candidaturas de voluntariado e notificações
const candidaturaVoluntariadoService = require('../../Services/candidaturaVoluntariadoService');
const notificacaoService = require('../../Services/notificacaoService');

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mCandidaturaVoluntariado = {
        create: jest.fn(), // Mock para criar candidaturas
        findFirst: jest.fn(), // Mock para verificar candidaturas existentes
        findMany: jest.fn(), // Mock para listar candidaturas
        update: jest.fn(), // Mock para atualizar candidaturas
        delete: jest.fn(), // Mock para remover candidaturas
    };

    const mAnuncio = {
        findUnique: jest.fn(), // Mock para obter um anúncio
    };

    const mPrismaClient = {
        candidaturaVoluntariado: mCandidaturaVoluntariado,
        anuncio: mAnuncio,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

// Mock do serviço de notificações
jest.mock('../../Services/notificacaoService', () => ({
    criarNotificacao: jest.fn(), // Mock para criar notificações
}));

// Suite de testes para o serviço de candidaturas de voluntariado
describe('CandidaturaVoluntariado Service', () => {
    // Dados simulados para os testes
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

    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Teste para criar uma nova candidatura e enviar notificações
    test('criarCandidatura deve criar uma nova candidatura e notificar', async () => {
        prisma.anuncio.findUnique.mockResolvedValue(mockAnuncio);
        prisma.candidaturaVoluntariado.findFirst.mockResolvedValue(null); // Nenhuma candidatura existente
        prisma.candidaturaVoluntariado.create.mockResolvedValue(mockCandidatura);

        const candidatura = await candidaturaVoluntariadoService.criarCandidatura(mockData);

        // Verifica se a candidatura foi criada corretamente
        expect(candidatura).toEqual(mockCandidatura);
        expect(prisma.candidaturaVoluntariado.create).toHaveBeenCalledWith({
            data: {
                id_utilizador: mockData.id_utilizador,
                id_anuncio: mockData.id_anuncio,
                estado: "Pendente",
                mensagem: null, // Valor padrão
            },
        });

        // Verifica se a notificação foi criada corretamente
        expect(notificacaoService.criarNotificacao).toHaveBeenCalledWith({
            id_utilizador: mockCandidatura.id_utilizador,
            id_administrador: mockAnuncio.id_administrador,
            mensagem: `Nova candidatura para "${mockAnuncio.cargo}"`,
            estado: "Por_abrir",
        });
    });

    // Teste para lançar erro se o anúncio não for encontrado
    test('criarCandidatura deve lançar erro se o anúncio não for encontrado', async () => {
        prisma.anuncio.findUnique.mockResolvedValue(null); // Anúncio não encontrado

        await expect(candidaturaVoluntariadoService.criarCandidatura(mockData))
            .rejects
            .toThrow("Anúncio não encontrado.");
    });

    // Teste para lançar erro se já existir uma candidatura pendente
    test('criarCandidatura deve lançar erro se já existir uma candidatura pendente', async () => {
        prisma.anuncio.findUnique.mockResolvedValue(mockAnuncio);
        prisma.candidaturaVoluntariado.findFirst.mockResolvedValue(mockCandidatura); // Candidatura existente

        await expect(candidaturaVoluntariadoService.criarCandidatura(mockData))
            .rejects
            .toThrow("Já existe uma candidatura pendente para este anúncio.");
    });

    // Teste para avaliar uma candidatura e enviar notificações
    test('avaliarCandidatura deve atualizar o estado da candidatura e notificar', async () => {
        const novoEstado = "Aceite";

        prisma.candidaturaVoluntariado.update.mockResolvedValue({
            ...mockCandidatura,
            estado: novoEstado,
        });

        const candidaturaAtualizada = await candidaturaVoluntariadoService.avaliarCandidatura(mockCandidatura.id, novoEstado, 1);

        // Verifica se o estado foi atualizado corretamente
        expect(candidaturaAtualizada.estado).toBe(novoEstado);
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

    // Teste para lançar erro se o estado for inválido
    test('avaliarCandidatura deve lançar erro se o estado for inválido', async () => {
        await expect(candidaturaVoluntariadoService.avaliarCandidatura(mockCandidatura.id, "Invalido", 1))
            .rejects
            .toThrow("Estado inválido. Use 'Aceite' ou 'Rejeitado'.");
    });

    // Teste para listar candidaturas de um anúncio
    test('listarPorAnuncio deve retornar todas as candidaturas de um anúncio', async () => {
        prisma.candidaturaVoluntariado.findMany.mockResolvedValue([mockCandidatura]);

        const candidaturas = await candidaturaVoluntariadoService.listarPorAnuncio(mockData.id_anuncio);

        // Verifica se as candidaturas foram listadas corretamente
        expect(Array.isArray(candidaturas)).toBe(true);
        expect(candidaturas.length).toBeGreaterThan(0);
        expect(candidaturas[0]).toEqual(mockCandidatura);
    });

    // Teste para remover uma candidatura
    test('removerCandidatura deve remover uma candidatura', async () => {
        prisma.candidaturaVoluntariado.delete.mockResolvedValue(mockCandidatura);

        const candidaturaRemovida = await candidaturaVoluntariadoService.removerCandidatura(mockCandidatura.id);

        // Verifica se a candidatura foi removida corretamente
        expect(candidaturaRemovida).toEqual(mockCandidatura);
        expect(prisma.candidaturaVoluntariado.delete).toHaveBeenCalledWith({
            where: { id: mockCandidatura.id },
        });
    });
});