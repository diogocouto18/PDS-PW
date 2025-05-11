// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa o serviço de notificações
const notificacaoService = require('../../Services/notificacaoService');

// Importa a função do serviço de pagamentos que será testada
const { comprarRifas } = require('../../Services/pagamentoService');

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        rifa: {
            findMany: jest.fn(), // Mock para listar rifas disponíveis
            update: jest.fn(), // Mock para atualizar o estado de uma rifa
        },
        sorteioRifas: {
            findUnique: jest.fn(), // Mock para obter detalhes de um sorteio
        },
        pagamento: {
            create: jest.fn(), // Mock para criar um pagamento
        },
        utilizador: {
            findMany: jest.fn(), // Mock para listar utilizadores
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Mock do serviço de notificações
jest.mock('../../Services/notificacaoService', () => ({
    criarNotificacao: jest.fn(), // Mock para criar notificações
}));

// Suite de testes para o serviço de pagamentos
describe('Pagamento Service', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Teste para processar a compra de rifas e gerar o pagamento
    test('comprarRifas deve processar a compra de rifas e gerar o pagamento', async () => {
        const mockData = {
            id_utilizador: 1,
            id_sorteio: 1,
            quantidadeCompra: 3,
            metodo_pagamento: 'Cartão de Crédito',
        };

        const mockRifasDisponiveis = [
            { id: 1, estado: 'PorComprar' },
            { id: 2, estado: 'PorComprar' },
            { id: 3, estado: 'PorComprar' },
        ];

        const mockSorteio = {
            id: 1,
            nome: 'Sorteio Teste',
            preco: 10,
            quantidadeTotal: 10,
            descricao: 'Sorteio de uma TV',
            premio: 'TV',
            data_sorteio: new Date(),
            id_administrador: 1,
        };

        const mockPagamento = {
            id: 1,
            id_utilizador: 1,
            id_sorteio: 1,
            quantidadeCompra: 3,
            valor_Total: 30,
            metodo_pagamento: 'Cartão de Crédito',
            estado: 'Pago',
        };

        // Configura os mocks para simular o comportamento esperado
        prisma.rifa.findMany.mockResolvedValue(mockRifasDisponiveis);
        prisma.sorteioRifas.findUnique.mockResolvedValue(mockSorteio);
        prisma.pagamento.create.mockResolvedValue(mockPagamento);
        prisma.rifa.update.mockResolvedValue({ ...mockRifasDisponiveis[0], estado: 'Comprada' });
        notificacaoService.criarNotificacao.mockResolvedValue({});

        // Chama a função comprarRifas
        const pagamento = await comprarRifas(
            mockData.id_utilizador,
            mockData.id_sorteio,
            mockData.quantidadeCompra,
            mockData.metodo_pagamento
        );

        // Verifica se o pagamento foi criado corretamente
        expect(pagamento).toEqual(mockPagamento);
        expect(prisma.rifa.findMany).toHaveBeenCalledWith({
            where: {
                id_sorteio: mockData.id_sorteio,
                estado: 'PorComprar',
            },
            take: mockData.quantidadeCompra,
        });
        expect(prisma.pagamento.create).toHaveBeenCalledWith({
            data: {
                id_utilizador: mockData.id_utilizador,
                id_sorteio: mockData.id_sorteio,
                quantidadeCompra: mockData.quantidadeCompra,
                valor_Total: mockSorteio.preco * mockData.quantidadeCompra,
                metodo_pagamento: mockData.metodo_pagamento,
                estado: 'Pago',
            },
        });
        expect(prisma.rifa.update).toHaveBeenCalledTimes(mockData.quantidadeCompra); // Verifica se o número correto de rifas foi atualizado
        expect(notificacaoService.criarNotificacao).toHaveBeenCalledWith({
            id_utilizador: mockData.id_utilizador,
            id_administrador: mockSorteio.id_administrador,
            mensagem: `Pagamento de ${mockData.quantidadeCompra} rifas no sorteio "${mockSorteio.nome}" concluído com sucesso.`,
            estado: 'Por_abrir',
        });
    });

    // Teste para lançar erro quando não houver rifas suficientes disponíveis
    test('comprarRifas deve lançar erro quando não houver rifas suficientes disponíveis', async () => {
        const mockData = {
            id_utilizador: 1,
            id_sorteio: 1,
            quantidadeCompra: 5,
            metodo_pagamento: 'Cartão de Crédito',
        };

        const mockRifasDisponiveis = [
            { id: 1, estado: 'PorComprar' },
            { id: 2, estado: 'PorComprar' },
            { id: 3, estado: 'PorComprar' },
        ];

        // Configura os mocks para simular rifas insuficientes
        prisma.rifa.findMany.mockResolvedValue(mockRifasDisponiveis);
        prisma.sorteioRifas.findUnique.mockResolvedValue({ id: 1, preco: 10 });

        // Verifica se a função lança um erro ao tentar comprar mais rifas do que as disponíveis
        await expect(
            comprarRifas(mockData.id_utilizador, mockData.id_sorteio, 5, mockData.metodo_pagamento)
        ).rejects.toThrow('Não há rifas suficientes disponíveis.');
    });
});