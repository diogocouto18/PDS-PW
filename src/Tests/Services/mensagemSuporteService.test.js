// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa as funções do serviço de mensagens de suporte que serão testadas
const {
    criarMensagemInicial,
    enviarResposta,
    fecharTicket,
    listarMensagensDoTicket,
    eliminarTicket
} = require('../../Services/mensagemSuporteService');

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mMensagemSuporte = {
        create: jest.fn(), // Mock para criar mensagens
        findMany: jest.fn(), // Mock para listar mensagens
        findUnique: jest.fn(), // Mock para obter uma mensagem específica
        update: jest.fn(), // Mock para atualizar mensagens
        deleteMany: jest.fn(), // Mock para eliminar mensagens
    };

    const mPrismaClient = {
        mensagemSuporte: mMensagemSuporte,
        administrador: {
            findMany: jest.fn(), // Mock para listar administradores
        }
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

// Suite de testes para o serviço de mensagens de suporte
describe('Mensagem Suporte Service', () => {
    // Dados simulados para os testes
    const mockData = {
        id_ticket: 1,
        mensagem: "Mensagem de suporte",
        id_utilizador: 1
    };

    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Teste para listar todas as mensagens de um ticket
    test('listarMensagensDoTicket deve retornar todas as mensagens de um ticket', async () => {
        // Mock para retornar mensagens
        const mockMensagens = [
            { id: 1, id_ticket: 1, mensagem: "Mensagem 1", estado: "Aberto" },
            { id: 2, id_ticket: 1, mensagem: "Mensagem 2", estado: "Aberto" }
        ];

        prisma.mensagemSuporte.findMany.mockResolvedValue(mockMensagens);

        const mensagens = await listarMensagensDoTicket(mockData.id_ticket);

        // Verifica se as mensagens foram listadas corretamente
        expect(Array.isArray(mensagens)).toBe(true);
        expect(mensagens.length).toBeGreaterThan(0); // Espera que o número de mensagens seja maior que 0
        expect(prisma.mensagemSuporte.findMany).toHaveBeenCalledWith({
            where: { id_ticket: mockData.id_ticket },
            orderBy: { data_abertura: "asc" } // Ordena por data de abertura
        });
    });

    // Teste para fechar as mensagens abertas de um ticket
    test('fecharTicket deve fechar as mensagens abertas de um ticket', async () => {
        // Mock para retornar mensagens abertas
        const mockMensagens = [
            { id: 1, id_ticket: 1, mensagem: "Mensagem 1", estado: "Aberto" }
        ];

        prisma.mensagemSuporte.findMany.mockResolvedValue(mockMensagens);

        const result = await fecharTicket(mockData.id_ticket);

        // Verifica se as mensagens foram fechadas corretamente
        expect(result.length).toBeGreaterThan(0); // Espera que o número de mensagens fechadas seja maior que 0
        expect(prisma.mensagemSuporte.findMany).toHaveBeenCalledWith({
            where: { id_ticket: mockData.id_ticket, estado: "Aberto" }
        });
    });

    // Teste para eliminar todas as mensagens de um ticket
    test('eliminarTicket deve remover todas as mensagens de um ticket', async () => {
        const mockDeleteResponse = { count: 1 }; // Mock para a resposta de eliminação
        prisma.mensagemSuporte.deleteMany.mockResolvedValue(mockDeleteResponse);

        const eliminacao = await eliminarTicket(mockData.id_ticket);

        // Verifica se as mensagens foram eliminadas corretamente
        expect(eliminacao).toEqual({ count: 1 });
        expect(prisma.mensagemSuporte.deleteMany).toHaveBeenCalledWith({
            where: { id_ticket: mockData.id_ticket }
        });
    });

    // Teste para criar uma mensagem inicial
    test('criarMensagemInicial deve criar uma nova mensagem de suporte', async () => {
        const mockMensagemCriada = { id: 1, ...mockData, estado: "Aberto" };
        prisma.mensagemSuporte.create.mockResolvedValue(mockMensagemCriada);

        const mensagem = await criarMensagemInicial(mockData);

        // Verifica se a mensagem foi criada corretamente
        expect(mensagem).toEqual(mockMensagemCriada);
        expect(prisma.mensagemSuporte.create).toHaveBeenCalledWith({
            data: { ...mockData, estado: "Aberto" }
        });
    });

    // Teste para enviar uma resposta a um ticket
    test('enviarResposta deve adicionar uma nova mensagem ao ticket', async () => {
        const mockResposta = { id: 2, id_ticket: 1, mensagem: "Resposta do administrador", estado: "Aberto" };
        prisma.mensagemSuporte.create.mockResolvedValue(mockResposta);

        const resposta = await enviarResposta(mockData.id_ticket, "Resposta do administrador");

        // Verifica se a resposta foi adicionada corretamente
        expect(resposta).toEqual(mockResposta);
        expect(prisma.mensagemSuporte.create).toHaveBeenCalledWith({
            data: { id_ticket: mockData.id_ticket, mensagem: "Resposta do administrador", estado: "Aberto" }
        });
    });
});