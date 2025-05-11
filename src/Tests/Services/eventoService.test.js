// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa as funções do serviço de eventos que serão testadas
const {
    criarEvento,
    listarEventos,
    obterEventoPorId,
    atualizarEvento,
    eliminarEvento
} = require('../../Services/eventoService'); // Caminho para o serviço

// Importa o serviço de notificações
const notificacaoService = require("../../Services/notificacaoService");

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        evento: {
            create: jest.fn(), // Mock para criar eventos
            findMany: jest.fn(), // Mock para listar eventos
            findUnique: jest.fn(), // Mock para obter um evento por ID
            update: jest.fn(), // Mock para atualizar eventos
            delete: jest.fn(), // Mock para eliminar eventos
        },
        utilizador: {
            findMany: jest.fn(), // Mock para listar utilizadores
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Mock do serviço de notificações
jest.mock("../../Services/notificacaoService", () => ({
    criarNotificacao: jest.fn(), // Mock para criar notificações
}));

// Suite de testes para o serviço de eventos
describe('Evento Service', () => {
    // Configuração inicial antes de todos os testes
    beforeAll(() => {
        // Mock para findMany - Lista de eventos
        prisma.evento.findMany.mockResolvedValue([
            { id: 1, titulo: 'Evento 1', localizacao: 'Local 1', estado: 'Ativo' },
            { id: 2, titulo: 'Evento 2', localizacao: 'Local 2', estado: 'Ativo' },
        ]);

        // Mock para findUnique - Retorna um evento específico
        prisma.evento.findUnique.mockResolvedValue({
            id: 1,
            titulo: 'Evento 1',
            localizacao: 'Local 1',
            estado: 'Ativo',
        });

        // Mock para create - Criação de evento
        prisma.evento.create.mockResolvedValue({
            id: 1,
            titulo: 'Evento 1',
            localizacao: 'Local 1',
            estado: 'Ativo',
            id_administrador: 1,
            id_categoria: 1,
        });

        // Mock para update - Atualização de evento
        prisma.evento.update.mockResolvedValue({
            id: 1,
            titulo: 'Evento Atualizado',
            localizacao: 'Local Atualizado',
            estado: 'Ativo',
            id_administrador: 1,
            id_categoria: 1,
        });

        // Mock para delete - Exclusão de evento
        prisma.evento.delete.mockResolvedValue({
            id: 1,
            titulo: 'Evento 1',
            localizacao: 'Local 1',
            estado: 'Ativo',
            id_administrador: 1,
            id_categoria: 1,
        });

        // Mock para utilizador.findMany
        prisma.utilizador.findMany.mockResolvedValue([
            { id: 1 },
            { id: 2 },
        ]);
    });

    // Teste para listar eventos
    test('listarEventos deve retornar um array de eventos', async () => {
        const eventos = await listarEventos();
        expect(Array.isArray(eventos)).toBe(true); // Verifica se o retorno é um array
        expect(eventos.length).toBeGreaterThan(0); // Verifica se há ao menos um evento
    });

    // Teste para obter um evento por ID
    test('obterEventoPorId deve retornar um evento ou null', async () => {
        const evento = await obterEventoPorId(1);
        expect(evento).toHaveProperty('id', 1); // Verifica se o ID corresponde
        expect(evento.titulo).toBe('Evento 1'); // Verifica o título do evento

        // Simula o retorno null caso o evento não exista
        prisma.evento.findUnique.mockResolvedValueOnce(null);
        const eventoInexistente = await obterEventoPorId(99999);
        expect(eventoInexistente).toBeNull(); // Verifica se o retorno é null
    });

    // Teste para criar um evento e enviar notificações
    test('criarEvento deve criar um evento e enviar notificações para utilizadores', async () => {
        const novoEvento = await criarEvento({
            titulo: 'Evento Teste',
            localizacao: 'Local Teste',
            descricao: 'Descricao Teste',
            data_evento: '2025-12-25',
            fotografia: 'foto.jpg',
            id_administrador: 1,
            id_categoria: 1,
        });

        // Verifica se o evento foi criado corretamente
        expect(novoEvento).toHaveProperty('id');
        expect(notificacaoService.criarNotificacao).toHaveBeenCalledTimes(2); // Verifica se 2 notificações foram criadas
    });

    // Teste para atualizar um evento
    test('atualizarEvento deve modificar os dados corretamente', async () => {
        const atualizado = await atualizarEvento(1, { titulo: 'Evento Atualizado' });
        expect(atualizado.titulo).toBe('Evento Atualizado'); // Verifica se o título foi atualizado
    });

    // Teste para eliminar um evento
    test('eliminarEvento deve remover o evento corretamente', async () => {
        // Primeiro, garantir que o evento existe
        const eventoAntes = await obterEventoPorId(1);
        expect(eventoAntes).not.toBeNull(); // Verifica que o evento existe

        // Simula a exclusão
        await eliminarEvento(1);

        // Mock para retornar null após exclusão
        prisma.evento.findUnique.mockResolvedValueOnce(null); // Simula a exclusão do evento

        // Verifica se o evento foi removido
        const eventoDepois = await obterEventoPorId(1);
        expect(eventoDepois).toBeNull(); // Verifica que o evento já não existe
    });
});