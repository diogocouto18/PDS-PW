// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa as funções do serviço de avaliações de eventos que serão testadas
const {
    criarAvaliacao,
    listarPorEvento,
    atualizarAvaliacao,
    eliminarAvaliacao,
    mediaDoEvento,
} = require('../../Services/avaliacaoEventoService');

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mAvaliacaoEvento = {
        create: jest.fn(), // Mock para criar avaliações
        findMany: jest.fn(), // Mock para listar avaliações
        update: jest.fn(), // Mock para atualizar avaliações
        delete: jest.fn(), // Mock para remover avaliações
        aggregate: jest.fn(), // Mock para calcular a média das avaliações
    };

    const mPrismaClient = {
        avaliacaoEvento: mAvaliacaoEvento,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

// Suite de testes para o serviço de avaliações de eventos
describe('Avaliacao Evento Service', () => {
    // Dados simulados para os testes
    const mockData = {
        id_utilizador: 1,
        id_evento: 2,
        nota: 4,
    };

    const mockAvaliacao = {
        id: 1,
        id_utilizador: 1,
        id_evento: 2,
        nota: 4,
    };

    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Teste para criar uma nova avaliação
    test('criarAvaliacao deve criar uma nova avaliação', async () => {
        prisma.avaliacaoEvento.create.mockResolvedValue(mockAvaliacao);

        const avaliacao = await criarAvaliacao(mockData);

        // Verifica se a avaliação foi criada corretamente
        expect(avaliacao).toEqual(mockAvaliacao);
        expect(prisma.avaliacaoEvento.create).toHaveBeenCalledWith({
            data: mockData,
        });
    });

    // Teste para listar todas as avaliações de um evento
    test('listarPorEvento deve listar todas as avaliações de um evento', async () => {
        const mockAvaliacoes = [mockAvaliacao];
        prisma.avaliacaoEvento.findMany.mockResolvedValue(mockAvaliacoes);

        const avaliacoes = await listarPorEvento(mockData.id_evento);

        // Verifica se as avaliações foram listadas corretamente
        expect(Array.isArray(avaliacoes)).toBe(true);
        expect(avaliacoes.length).toBeGreaterThan(0);
        expect(avaliacoes[0]).toEqual(mockAvaliacao);
    });

    // Teste para atualizar a nota de uma avaliação
    test('atualizarAvaliacao deve modificar a nota de uma avaliação', async () => {
        const updatedData = { nota: 5 };
        prisma.avaliacaoEvento.update.mockResolvedValue({
            ...mockAvaliacao,
            ...updatedData,
        });

        const avaliacaoAtualizada = await atualizarAvaliacao(mockAvaliacao.id, updatedData);

        // Verifica se a nota foi atualizada corretamente
        expect(avaliacaoAtualizada.nota).toBe(updatedData.nota);
        expect(prisma.avaliacaoEvento.update).toHaveBeenCalledWith({
            where: { id: mockAvaliacao.id },
            data: updatedData,
        });
    });

    // Teste para remover uma avaliação
    test('eliminarAvaliacao deve remover uma avaliação', async () => {
        prisma.avaliacaoEvento.delete.mockResolvedValue(mockAvaliacao);

        const avaliacaoRemovida = await eliminarAvaliacao(mockAvaliacao.id);

        // Verifica se a avaliação foi removida corretamente
        expect(avaliacaoRemovida).toEqual(mockAvaliacao);
        expect(prisma.avaliacaoEvento.delete).toHaveBeenCalledWith({
            where: { id: mockAvaliacao.id },
        });
    });

    // Teste para calcular a média das avaliações de um evento
    test('mediaDoEvento deve calcular a média das avaliações de um evento', async () => {
        const mockMedia = { _avg: { nota: 4.5 } };
        prisma.avaliacaoEvento.aggregate.mockResolvedValue(mockMedia);

        const media = await mediaDoEvento(mockData.id_evento);

        // Verifica se a média foi calculada corretamente
        expect(media).toBe(4.5);
        expect(prisma.avaliacaoEvento.aggregate).toHaveBeenCalledWith({
            _avg: { nota: true },
            where: { id_evento: mockData.id_evento },
        });
    });
});