const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
    criarAvaliacao,
    listarPorEvento,
    atualizarAvaliacao,
    eliminarAvaliacao,
    mediaDoEvento,
} = require('../../Services/avaliacaoEventoService');

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
    const mAvaliacaoEvento = {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        aggregate: jest.fn(),
    };

    const mPrismaClient = {
        avaliacaoEvento: mAvaliacaoEvento,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

describe('Avaliacao Evento Service', () => {
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

    beforeEach(() => {
        // Resetar os mocks antes de cada teste
        jest.clearAllMocks();
    });

    test('criarAvaliacao deve criar uma nova avaliação', async () => {
        prisma.avaliacaoEvento.create.mockResolvedValue(mockAvaliacao);

        const avaliacao = await criarAvaliacao(mockData);
        expect(avaliacao).toEqual(mockAvaliacao);
        expect(prisma.avaliacaoEvento.create).toHaveBeenCalledWith({
            data: mockData,
        });
    });

    test('listarPorEvento deve listar todas as avaliações de um evento', async () => {
        const mockAvaliacoes = [mockAvaliacao];
        prisma.avaliacaoEvento.findMany.mockResolvedValue(mockAvaliacoes);

        const avaliacoes = await listarPorEvento(mockData.id_evento);
        expect(Array.isArray(avaliacoes)).toBe(true);
        expect(avaliacoes.length).toBeGreaterThan(0);
        expect(avaliacoes[0]).toEqual(mockAvaliacao);
    });

    test('atualizarAvaliacao deve modificar a nota de uma avaliação', async () => {
        const updatedData = { nota: 5 };
        prisma.avaliacaoEvento.update.mockResolvedValue({
            ...mockAvaliacao,
            ...updatedData,
        });

        const avaliacaoAtualizada = await atualizarAvaliacao(mockAvaliacao.id, updatedData);
        expect(avaliacaoAtualizada.nota).toBe(updatedData.nota);
    });

    test('eliminarAvaliacao deve remover uma avaliação', async () => {
        prisma.avaliacaoEvento.delete.mockResolvedValue(mockAvaliacao);

        const avaliacaoRemovida = await eliminarAvaliacao(mockAvaliacao.id);
        expect(avaliacaoRemovida).toEqual(mockAvaliacao);
    });

    test('mediaDoEvento deve calcular a média das avaliações de um evento', async () => {
        const mockMedia = { _avg: { nota: 4.5 } };
        prisma.avaliacaoEvento.aggregate.mockResolvedValue(mockMedia);

        const media = await mediaDoEvento(mockData.id_evento);
        expect(media).toBe(4.5);
        expect(prisma.avaliacaoEvento.aggregate).toHaveBeenCalledWith({
            _avg: { nota: true },
            where: { id_evento: mockData.id_evento },
        });
    });
});