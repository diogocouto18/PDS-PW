const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const notificacaoService = require('../../Services/notificacaoService');
const { comprarRifas } = require('../../Services/pagamentoService');

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        rifa: {
            findMany: jest.fn(),
            update: jest.fn(),
        },
        sorteioRifas: {
            findUnique: jest.fn(),
        },
        pagamento: {
            create: jest.fn(),
        },
        utilizador: {
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Mock do notificacaoService
jest.mock('../../Services/notificacaoService', () => ({
    criarNotificacao: jest.fn()
}));

describe('Pagamento Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

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

        // Mocking dos métodos Prisma
        prisma.rifa.findMany.mockResolvedValue(mockRifasDisponiveis);
        prisma.sorteioRifas.findUnique.mockResolvedValue(mockSorteio);
        prisma.pagamento.create.mockResolvedValue(mockPagamento);
        prisma.rifa.update.mockResolvedValue({ ...mockRifasDisponiveis[0], estado: 'Comprada' });

        // Mocking da notificação
        notificacaoService.criarNotificacao.mockResolvedValue({});

        // Chama a função comprarRifas
        const pagamento = await comprarRifas(
            mockData.id_utilizador,
            mockData.id_sorteio,
            mockData.quantidadeCompra,
            mockData.metodo_pagamento
        );

        // Verificações
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
        expect(prisma.rifa.update).toHaveBeenCalledTimes(mockData.quantidadeCompra); // Verifica quantas rifas foram atualizadas
        expect(notificacaoService.criarNotificacao).toHaveBeenCalledWith({
            id_utilizador: mockData.id_utilizador,
            id_administrador: mockSorteio.id_administrador,
            mensagem: `Pagamento de ${mockData.quantidadeCompra} rifas no sorteio "${mockSorteio.nome}" concluído com sucesso.`,
            estado: 'Por_abrir',
        });
    });

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

        prisma.rifa.findMany.mockResolvedValue(mockRifasDisponiveis);
        prisma.sorteioRifas.findUnique.mockResolvedValue({ id: 1, preco: 10 });

        // Teste para rifas insuficientes
        await expect(
            comprarRifas(mockData.id_utilizador, mockData.id_sorteio, 5, mockData.metodo_pagamento)
        ).rejects.toThrow('Não há rifas suficientes disponíveis.');
    });

});