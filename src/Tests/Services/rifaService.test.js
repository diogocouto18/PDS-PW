const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
    listarRifasPorSorteio,
    listarRifasUtilizador,
    atualizarEstadoRifa,
    obterRifaPorId,
} = require('../../Services/rifaService');

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
    const mRifa = {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    };

    const mPrismaClient = {
        rifa: mRifa,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

describe('Rifa Service', () => {
    const mockData = {
        id_sorteio: 1,
        id_utilizador: 2,
        estado: 'PorComprar',
    };

    const mockRifa = {
        id: 1,
        id_sorteio: 1,
        id_utilizador: 2,
        estado: 'PorComprar',
    };

    beforeEach(() => {
        // Resetar os mocks antes de cada teste
        jest.clearAllMocks();

        // Garantir que o mock do findUnique retorne o mock correto
        prisma.rifa.findUnique.mockResolvedValue(mockRifa); // Para o ID existente
        prisma.rifa.findUnique.mockResolvedValueOnce(null); // Para o ID inexistente
    });

    test('listarRifasPorSorteio deve listar todas as rifas de um sorteio', async () => {
        const mockRifas = [mockRifa];
        prisma.rifa.findMany.mockResolvedValue(mockRifas);

        const rifas = await listarRifasPorSorteio(mockData.id_sorteio);
        expect(Array.isArray(rifas)).toBe(true);
        expect(rifas.length).toBeGreaterThan(0);
        expect(rifas[0]).toEqual(mockRifa);
    });

    test('listarRifasUtilizador deve listar todas as rifas de um utilizador', async () => {
        const mockRifas = [mockRifa];
        prisma.rifa.findMany.mockResolvedValue(mockRifas);

        const rifas = await listarRifasUtilizador(mockData.id_utilizador);
        expect(Array.isArray(rifas)).toBe(true);
        expect(rifas.length).toBeGreaterThan(0);
        expect(rifas[0]).toEqual(mockRifa);
    });

    test('obterRifaPorId deve retornar uma rifa ou null', async () => {
        const rifaExistente = await obterRifaPorId(mockRifa.id); // ID existente
        const rifaInexistente = await obterRifaPorId(99999); // ID inexistente

        expect(rifaExistente).toEqual(mockRifa);
        expect(rifaInexistente).toBeNull();
    });

    test('atualizarEstadoRifa deve atualizar o estado de uma rifa', async () => {
        const novoEstado = 'Comprada';
        prisma.rifa.update.mockResolvedValue({ ...mockRifa, estado: novoEstado });

        const rifaAtualizada = await atualizarEstadoRifa(mockRifa.id, novoEstado);
        expect(rifaAtualizada.estado).toBe(novoEstado);
    });

    test('atualizarEstadoRifa deve lançar um erro se o estado for inválido', async () => {
        const novoEstadoInvalido = 'EstadoInvalido';

        await expect(atualizarEstadoRifa(mockRifa.id, novoEstadoInvalido))
            .rejects
            .toThrowError('Estado inválido. Use um dos: Vencedor, SegundoLugar, TerceiroLugar, Perdedor, PorComprar, Comprada');
    });
});