/**
 * mensagemSuporteService.test.js
 *
 * Testes unitários para o serviço de mensagens de suporte.
 * Usamos Jest para validar as funções de criação, resposta, fechamento, listagem e exclusão de tickets.
 */

// Mock do PrismaClient
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
    criarMensagemInicial,
    enviarResposta,
    fecharTicket,
    listarMensagensDoTicket,
    eliminarTicket
} = require('../../Services/mensagemSuporteService');

jest.mock('@prisma/client', () => {
    const mMensagemSuporte = {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn(),
    };

    const mPrismaClient = {
        mensagemSuporte: mMensagemSuporte,
        administrador: {
            findMany: jest.fn()
        }
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

describe('Mensagem Suporte Service', () => {
    const mockData = {
        id_ticket: 1,
        mensagem: "Mensagem de suporte",
        id_utilizador: 1
    };

    const mockArtigo = { artigo: "Artigo 1", descricao: "Descrição do artigo" };
    const mockId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('listarMensagensDoTicket deve retornar todas as mensagens de um ticket', async () => {
        // Mock para retornar mensagens
        const mockMensagens = [
            { id: 1, id_ticket: 1, mensagem: "Mensagem 1", estado: "Aberto" },
            { id: 2, id_ticket: 1, mensagem: "Mensagem 2", estado: "Aberto" }
        ];

        prisma.mensagemSuporte.findMany.mockResolvedValue(mockMensagens);

        const mensagens = await listarMensagensDoTicket(mockData.id_ticket);
        expect(Array.isArray(mensagens)).toBe(true);
        expect(mensagens.length).toBeGreaterThan(0); // Espera que o número de mensagens seja maior que 0
        expect(prisma.mensagemSuporte.findMany).toHaveBeenCalledWith({
            where: { id_ticket: mockData.id_ticket },
            orderBy: { data_abertura: "asc" }
        });
    });

    test('fecharTicket deve fechar as mensagens abertas de um ticket', async () => {
        // Mock para retornar mensagens abertas
        const mockMensagens = [
            { id: 1, id_ticket: 1, mensagem: "Mensagem 1", estado: "Aberto" }
        ];

        prisma.mensagemSuporte.findMany.mockResolvedValue(mockMensagens);

        const result = await fecharTicket(mockData.id_ticket);
        expect(result.length).toBeGreaterThan(0); // Espera que o número de mensagens fechadas seja maior que 0
    });

    test('eliminarTicket deve remover todas as mensagens de um ticket', async () => {
        const mockDeleteResponse = { count: 1 };
        prisma.mensagemSuporte.deleteMany.mockResolvedValue(mockDeleteResponse);

        const eliminacao = await eliminarTicket(mockData.id_ticket);
        expect(eliminacao).toEqual({ count: 1 });
        expect(prisma.mensagemSuporte.deleteMany).toHaveBeenCalledWith({
            where: { id_ticket: mockData.id_ticket }
        });
    });
});