// src/Tests/Services/notificacaoService.test.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
    criarNotificacao,
    listarNotificacoesPorUtilizador,
    listarNotificacoesPorAdministrador,
    abrirNotificacao,
    apagarNotificacao,
} = require('../../Services/notificacaoService'); // Caminho para o seu service

jest.mock('@prisma/client', () => {
    const mNotificacao = {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mPrismaClient = {
        notificacao: mNotificacao,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

describe('Notificacao Service', () => {
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

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('criarNotificacao deve criar uma nova notificação', async () => {
        const createMock = prisma.notificacao.create;
        createMock.mockResolvedValue(mockNotificacao);

        const notificacao = await criarNotificacao(mockData);

        // Aqui, precisamos considerar o estado 'Por_abrir' na comparação
        expect(notificacao).toEqual(mockNotificacao);

        // Adicionamos o campo 'estado' no objeto esperado para a comparação correta
        expect(createMock).toHaveBeenCalledWith({
            data: {
                ...mockData,  // espalha o mockData para incluir id_utilizador, id_administrador, mensagem
                estado: 'Por_abrir',  // Adicionando o campo de estado esperado
            },
        });
    });

    test('listarNotificacoesPorUtilizador deve retornar as notificações de um utilizador', async () => {
        const mockNotificacoes = [mockNotificacao];
        const findManyMock = prisma.notificacao.findMany;
        findManyMock.mockResolvedValue(mockNotificacoes);

        const notificacoes = await listarNotificacoesPorUtilizador(mockData.id_utilizador);
        expect(Array.isArray(notificacoes)).toBe(true);
        expect(notificacoes.length).toBeGreaterThan(0);
        expect(notificacoes[0]).toEqual(mockNotificacao);
    });

    test('listarNotificacoesPorAdministrador deve retornar as notificações de um administrador', async () => {
        const mockNotificacoes = [mockNotificacao];
        const findManyMock = prisma.notificacao.findMany;
        findManyMock.mockResolvedValue(mockNotificacoes);

        const notificacoes = await listarNotificacoesPorAdministrador(mockData.id_administrador);
        expect(Array.isArray(notificacoes)).toBe(true);
        expect(notificacoes.length).toBeGreaterThan(0);
        expect(notificacoes[0]).toEqual(mockNotificacao);
    });

    test('abrirNotificacao deve atualizar o estado para "Aberto"', async () => {
        const updateMock = prisma.notificacao.update;
        updateMock.mockResolvedValue({ ...mockNotificacao, estado: 'Aberto' });

        const notificacaoAtualizada = await abrirNotificacao(mockNotificacao.id);
        expect(notificacaoAtualizada.estado).toBe('Aberto');
        expect(updateMock).toHaveBeenCalledWith({
            where: { id: mockNotificacao.id },
            data: { estado: 'Aberto' },
        });
    });

    test('apagarNotificacao deve remover uma notificação', async () => {
        const deleteMock = prisma.notificacao.delete;
        deleteMock.mockResolvedValue(mockNotificacao);

        const notificacaoRemovida = await apagarNotificacao(mockNotificacao.id);
        expect(notificacaoRemovida).toEqual(mockNotificacao);
        expect(deleteMock).toHaveBeenCalledWith({
            where: { id: mockNotificacao.id },
        });
    });
});