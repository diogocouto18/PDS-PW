// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa as funções do serviço de rifas que serão testadas
const {
    listarRifasPorSorteio,
    listarRifasUtilizador,
    atualizarEstadoRifa,
    obterRifaPorId,
} = require('../../Services/rifaService');

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mRifa = {
        findMany: jest.fn(), // Mock para listar rifas
        findUnique: jest.fn(), // Mock para obter uma rifa por ID
        update: jest.fn(), // Mock para atualizar o estado de uma rifa
    };

    const mPrismaClient = {
        rifa: mRifa,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

// Suite de testes para o serviço de rifas
describe('Rifa Service', () => {
    // Dados simulados para os testes
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

    // Configuração inicial antes de cada teste
    beforeEach(() => {
        // Limpa os mocks para garantir que não há interferência entre os testes
        jest.clearAllMocks();

        // Configura o mock do método findUnique para retornar valores diferentes
        prisma.rifa.findUnique.mockResolvedValueOnce(mockRifa); // Para o ID existente
        prisma.rifa.findUnique.mockResolvedValueOnce(null); // Para o ID inexistente
    });

    // Teste para listar todas as rifas de um sorteio
    test('listarRifasPorSorteio deve listar todas as rifas de um sorteio', async () => {
        const mockRifas = [mockRifa]; // Dados simulados
        prisma.rifa.findMany.mockResolvedValue(mockRifas); // Configura o mock

        const rifas = await listarRifasPorSorteio(mockData.id_sorteio); // Chama a função
        expect(Array.isArray(rifas)).toBe(true); // Verifica se o retorno é um array
        expect(rifas.length).toBeGreaterThan(0); // Verifica se há rifas
        expect(rifas[0]).toEqual(mockRifa); // Verifica se a primeira rifa corresponde ao mock
    });

    // Teste para listar todas as rifas de um utilizador
    test('listarRifasUtilizador deve listar todas as rifas de um utilizador', async () => {
        const mockRifas = [mockRifa]; // Dados simulados
        prisma.rifa.findMany.mockResolvedValue(mockRifas); // Configura o mock

        const rifas = await listarRifasUtilizador(mockData.id_utilizador); // Chama a função
        expect(Array.isArray(rifas)).toBe(true); // Verifica se o retorno é um array
        expect(rifas.length).toBeGreaterThan(0); // Verifica se há rifas
        expect(rifas[0]).toEqual(mockRifa); // Verifica se a primeira rifa corresponde ao mock
    });

    // Teste para obter uma rifa por ID
    test('obterRifaPorId deve retornar uma rifa ou null', async () => {
        // Testa o ID existente
        const rifaExistente = await obterRifaPorId(mockRifa.id);
        expect(rifaExistente).toEqual(mockRifa); // Verifica se a rifa corresponde ao mock

        // Testa o ID inexistente
        const rifaInexistente = await obterRifaPorId(99999);
        expect(rifaInexistente).toBeNull(); // Verifica se o retorno é null
    });

    // Teste para atualizar o estado de uma rifa
    test('atualizarEstadoRifa deve atualizar o estado de uma rifa', async () => {
        const novoEstado = 'Comprada'; // Novo estado para a rifa
        prisma.rifa.update.mockResolvedValue({ ...mockRifa, estado: novoEstado }); // Configura o mock

        const rifaAtualizada = await atualizarEstadoRifa(mockRifa.id, novoEstado); // Chama a função
        expect(rifaAtualizada.estado).toBe(novoEstado); // Verifica se o estado foi atualizado
    });

    // Teste para lançar um erro ao tentar atualizar com um estado inválido
    test('atualizarEstadoRifa deve lançar um erro se o estado for inválido', async () => {
        const novoEstadoInvalido = 'EstadoInvalido'; // Estado inválido

        // Verifica se a função lança um erro ao tentar atualizar com um estado inválido
        await expect(atualizarEstadoRifa(mockRifa.id, novoEstadoInvalido))
            .rejects
            .toThrowError('Estado inválido. Use um dos: Vencedor, SegundoLugar, TerceiroLugar, Perdedor, PorComprar, Comprada');
    });
});