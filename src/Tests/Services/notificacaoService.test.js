// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa as funções do serviço de notificações que serão testadas
const {
    criarNotificacao,
    listarNotificacoesPorUtilizador,
    listarNotificacoesPorAdministrador,
    abrirNotificacao,
    apagarNotificacao,
} = require('../../Services/notificacaoService'); // Caminho para o ficheiro do serviço

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mNotificacao = {
        create: jest.fn(), // Mock para criar notificações
        findMany: jest.fn(), // Mock para listar notificações
        update: jest.fn(), // Mock para atualizar notificações
        delete: jest.fn(), // Mock para apagar notificações
    };

    const mPrismaClient = {
        notificacao: mNotificacao,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

// Suite de testes para o serviço de notificações
describe('Notificacao Service', () => {
    // Dados simulados para os testes
    const mockData = {
        id_utilizador: 1,
        id_administrador: 2,
        mensagem: 'Nova notificação!',
    };

    const mockNotificacao = {
        id: 1,
        id_utilizador: 1,
        id_administrador: 2,
        mensagem: 'Nova notificação!',
        estado: 'Por_abrir',
    };

    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Teste para criar uma nova notificação
    test('criarNotificacao deve criar uma nova notificação', async () => {
        const createMock = prisma.notificacao.create;
        createMock.mockResolvedValue(mockNotificacao);

        const notificacao = await criarNotificacao(mockData);

        // Verifica se a notificação foi criada corretamente
        expect(notificacao).toEqual(mockNotificacao);
        expect(createMock).toHaveBeenCalledWith({
            data: {
                ...mockData, // Inclui id_utilizador, id_administrador e mensagem
                estado: 'Por_abrir', // Adiciona o estado inicial
            },
        });
    });

    // Teste para listar notificações de um utilizador
    test('listarNotificacoesPorUtilizador deve retornar as notificações de um utilizador', async () => {
        const mockNotificacoes = [mockNotificacao];
        const findManyMock = prisma.notificacao.findMany;
        findManyMock.mockResolvedValue(mockNotificacoes);

        const notificacoes = await listarNotificacoesPorUtilizador(mockData.id_utilizador);

        // Verifica se as notificações foram listadas corretamente
        expect(Array.isArray(notificacoes)).toBe(true);
        expect(notificacoes.length).toBeGreaterThan(0);
        expect(notificacoes[0]).toEqual(mockNotificacao);
    });

    // Teste para listar notificações de um administrador
    test('listarNotificacoesPorAdministrador deve retornar as notificações de um administrador', async () => {
        const mockNotificacoes = [mockNotificacao];
        const findManyMock = prisma.notificacao.findMany;
        findManyMock.mockResolvedValue(mockNotificacoes);

        const notificacoes = await listarNotificacoesPorAdministrador(mockData.id_administrador);

        // Verifica se as notificações foram listadas corretamente
        expect(Array.isArray(notificacoes)).toBe(true);
        expect(notificacoes.length).toBeGreaterThan(0);
        expect(notificacoes[0]).toEqual(mockNotificacao);
    });

    // Teste para abrir uma notificação
    test('abrirNotificacao deve atualizar o estado para "Aberto"', async () => {
        const updateMock = prisma.notificacao.update;
        updateMock.mockResolvedValue({ ...mockNotificacao, estado: 'Aberto' });

        const notificacaoAtualizada = await abrirNotificacao(mockNotificacao.id);

        // Verifica se o estado foi atualizado corretamente
        expect(notificacaoAtualizada.estado).toBe('Aberto');
        expect(updateMock).toHaveBeenCalledWith({
            where: { id: mockNotificacao.id },
            data: { estado: 'Aberto' },
        });
    });

    // Teste para apagar uma notificação
    test('apagarNotificacao deve remover uma notificação', async () => {
        const deleteMock = prisma.notificacao.delete;
        deleteMock.mockResolvedValue(mockNotificacao);

        const notificacaoRemovida = await apagarNotificacao(mockNotificacao.id);

        // Verifica se a notificação foi removida corretamente
        expect(notificacaoRemovida).toEqual(mockNotificacao);
        expect(deleteMock).toHaveBeenCalledWith({
            where: { id: mockNotificacao.id },
        });
    });
});