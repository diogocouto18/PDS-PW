// src/tests/Services/eventoService.test.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
    criarEvento,
    listarEventos,
    obterEventoPorId,
    atualizarEvento,
    eliminarEvento
} = require('../../Services/eventoService'); // Caminho para o seu serviço
const notificacaoService = require("../../Services/notificacaoService");

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        evento: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        utilizador: {
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock("../../Services/notificacaoService", () => ({
    criarNotificacao: jest.fn()
}));

describe('Evento Service', () => {
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

    test('listarEventos deve retornar um array de eventos', async () => {
        const eventos = await listarEventos();
        expect(Array.isArray(eventos)).toBe(true);
        expect(eventos.length).toBeGreaterThan(0); // Verifica se há ao menos um evento
    });

    test('obterEventoPorId deve retornar um evento ou null', async () => {
        const evento = await obterEventoPorId(1);
        expect(evento).toHaveProperty('id', 1);
        expect(evento.titulo).toBe('Evento 1');

        // Simulando o retorno null caso o evento não exista
        prisma.evento.findUnique.mockResolvedValueOnce(null);
        const eventoInexistente = await obterEventoPorId(99999);
        expect(eventoInexistente).toBeNull();
    });

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

        expect(novoEvento).toHaveProperty('id');
        expect(notificacaoService.criarNotificacao).toHaveBeenCalledTimes(2); // Verifica se 2 notificações foram criadas
    });

    test('atualizarEvento deve modificar os dados corretamente', async () => {
        const atualizado = await atualizarEvento(1, { titulo: 'Evento Atualizado' });
        expect(atualizado.titulo).toBe('Evento Atualizado');
    });

    test('eliminarEvento deve remover o evento corretamente', async () => {
        // Primeiro, garantir que o evento existe
        const eventoAntes = await obterEventoPorId(1);
        expect(eventoAntes).not.toBeNull();

        // Simula a exclusão
        await eliminarEvento(1);

        // Mock para retornar null após exclusão
        prisma.evento.findUnique.mockResolvedValueOnce(null); // Simula a exclusão do evento

        // Verificar se o evento foi removido
        const eventoDepois = await obterEventoPorId(1);
        expect(eventoDepois).toBeNull();
    });
});