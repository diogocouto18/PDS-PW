// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa o serviço de notificações
const notificacaoService = require('../../Services/notificacaoService');

// Importa as funções do serviço de sorteio de rifas que serão testadas
const {
    criarSorteio,
    listarSorteios,
    atualizarSorteio,
    eliminarSorteio,
    sortearVencedor,
    sortearSegundoLugar,
    sortearTerceiroLugar,
} = require('../../Services/sorteioRifasService');

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        sorteioRifas: {
            create: jest.fn(), // Mock para criar sorteios
            findMany: jest.fn(), // Mock para listar sorteios
            update: jest.fn(), // Mock para atualizar sorteios
            delete: jest.fn(), // Mock para eliminar sorteios
        },
        rifa: {
            createMany: jest.fn(), // Mock para criar rifas
            findMany: jest.fn(), // Mock para listar rifas
            update: jest.fn(), // Mock para atualizar rifas
        },
        utilizador: {
            findMany: jest.fn(), // Mock para listar utilizadores
        }
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Mock do serviço de notificações
jest.mock('../../Services/notificacaoService', () => ({
    criarNotificacao: jest.fn(), // Mock para criar notificações
}));

// Suite de testes para o serviço de sorteio de rifas
describe('Sorteio Rifas Service', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Teste para criar um novo sorteio e gerar rifas
    test('criarSorteio deve criar um novo sorteio e gerar rifas', async () => {
        const mockData = {
            nome: 'Sorteio Teste',
            preco: 10,
            quantidadeTotal: 5,
            descricao: 'Sorteio de uma TV',
            premio: 'TV',
            data_sorteio: '2025-12-31', // Pode ser string ou Date
            id_administrador: 1,
            id_evento: 2
        };

        const mockSorteio = {
            id: 1,
            nome: 'Sorteio Teste',
            preco: 10,
            quantidadeTotal: 5,
            descricao: 'Sorteio de uma TV',
            premio: 'TV',
            data_sorteio: new Date('2025-12-31'), // Convertendo para Date
            id_administrador: 1,
            id_evento: 2,
        };

        const mockRifas = Array.from({ length: 5 }).map(() => ({
            id_sorteio: 1,
            estado: "PorComprar",
        }));

        // Configura os mocks para criar sorteios e rifas
        prisma.sorteioRifas.create.mockResolvedValue(mockSorteio);
        prisma.rifa.createMany.mockResolvedValue(mockRifas);

        // Mock para a consulta de utilizadores
        prisma.utilizador.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

        const sorteio = await criarSorteio(mockData);

        // Verifica se o sorteio foi criado corretamente
        expect(sorteio).toEqual(mockSorteio);
        expect(prisma.sorteioRifas.create).toHaveBeenCalledWith({
            data: {
                nome: mockData.nome,
                preco: parseFloat(mockData.preco),
                quantidadeTotal: parseInt(mockData.quantidadeTotal),
                descricao: mockData.descricao,
                premio: mockData.premio,
                data_sorteio: expect.any(Date), // Verifica se é uma instância de Date
                id_administrador: parseInt(mockData.id_administrador),
                id_evento: parseInt(mockData.id_evento),
            }
        });
        expect(prisma.rifa.createMany).toHaveBeenCalled();
        expect(prisma.utilizador.findMany).toHaveBeenCalled();
        expect(notificacaoService.criarNotificacao).toHaveBeenCalledTimes(2); // Verifica se a notificação foi chamada para cada utilizador
    });

    // Teste para listar todos os sorteios
    test('listarSorteios deve listar todos os sorteios existentes', async () => {
        const mockSorteios = [
            { id: 1, nome: 'Sorteio 1', data_sorteio: new Date('2025-12-31'), id_administrador: 1 },
            { id: 2, nome: 'Sorteio 2', data_sorteio: new Date('2026-12-31'), id_administrador: 2 }
        ];

        prisma.sorteioRifas.findMany.mockResolvedValue(mockSorteios);

        const sorteios = await listarSorteios();
        expect(sorteios).toEqual(mockSorteios);
        expect(prisma.sorteioRifas.findMany).toHaveBeenCalled();
    });

    // Teste para atualizar os dados de um sorteio
    test('atualizarSorteio deve atualizar os dados de um sorteio', async () => {
        const updatedData = { nome: 'Novo Sorteio Teste' };
        const mockSorteioAtualizado = { ...updatedData, id: 1, data_sorteio: new Date('2025-12-31') };

        prisma.sorteioRifas.update.mockResolvedValue(mockSorteioAtualizado);

        const sorteioAtualizado = await atualizarSorteio(1, updatedData);
        expect(sorteioAtualizado.nome).toBe(updatedData.nome);
        expect(prisma.sorteioRifas.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: updatedData,
        });
    });

    // Teste para eliminar um sorteio e suas rifas
    test('eliminarSorteio deve remover um sorteio e suas rifas', async () => {
        const mockSorteio = { id: 1, nome: 'Sorteio 1', data_sorteio: new Date('2025-12-31'), id_administrador: 1 };

        prisma.sorteioRifas.delete.mockResolvedValue(mockSorteio);

        const sorteioEliminado = await eliminarSorteio(1);
        expect(sorteioEliminado).toEqual(mockSorteio);
        expect(prisma.sorteioRifas.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    });

    // Teste para sortear um vencedor
    test('sortearVencedor deve sortear um vencedor e atualizar o estado da rifa', async () => {
        const mockRifa = { id: 1, estado: 'Comprada', id_utilizador: 2, id_sorteio: 1 };
        const mockRifaAtualizada = { ...mockRifa, estado: 'Vencedor' };

        prisma.rifa.findMany.mockResolvedValue([mockRifa]);
        prisma.rifa.update.mockResolvedValue(mockRifaAtualizada);
        notificacaoService.criarNotificacao.mockResolvedValue({});

        const vencedor = await sortearVencedor(1);
        expect(vencedor.estado).toBe('Vencedor');
        expect(prisma.rifa.update).toHaveBeenCalledWith({
            where: { id: mockRifa.id },
            data: { estado: 'Vencedor' },
        });
        expect(notificacaoService.criarNotificacao).toHaveBeenCalled();
    });

    // Teste para sortear o segundo lugar
    test('sortearSegundoLugar deve sortear o segundo lugar e atualizar o estado da rifa', async () => {
        const mockRifa = { id: 1, estado: 'Comprada', id_utilizador: 2, id_sorteio: 1 };
        const mockRifaAtualizada = { ...mockRifa, estado: 'SegundoLugar' };

        prisma.rifa.findMany.mockResolvedValue([mockRifa]);
        prisma.rifa.update.mockResolvedValue(mockRifaAtualizada);
        notificacaoService.criarNotificacao.mockResolvedValue({});

        const segundoLugar = await sortearSegundoLugar(1);
        expect(segundoLugar.estado).toBe('SegundoLugar');
        expect(prisma.rifa.update).toHaveBeenCalledWith({
            where: { id: mockRifa.id },
            data: { estado: 'SegundoLugar' },
        });
        expect(notificacaoService.criarNotificacao).toHaveBeenCalled();
    });

    // Teste para sortear o terceiro lugar
    test('sortearTerceiroLugar deve sortear o terceiro lugar e atualizar o estado da rifa', async () => {
        const mockRifa = { id: 1, estado: 'Comprada', id_utilizador: 2, id_sorteio: 1 };
        const mockRifaAtualizada = { ...mockRifa, estado: 'TerceiroLugar' };

        prisma.rifa.findMany.mockResolvedValue([mockRifa]);
        prisma.rifa.update.mockResolvedValue(mockRifaAtualizada);
        notificacaoService.criarNotificacao.mockResolvedValue({});

        const terceiroLugar = await sortearTerceiroLugar(1);
        expect(terceiroLugar.estado).toBe('TerceiroLugar');
        expect(prisma.rifa.update).toHaveBeenCalledWith({
            where: { id: mockRifa.id },
            data: { estado: 'TerceiroLugar' },
        });
        expect(notificacaoService.criarNotificacao).toHaveBeenCalled();
    });
});