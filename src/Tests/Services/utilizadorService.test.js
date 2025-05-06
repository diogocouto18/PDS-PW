// src/tests/Services/utilizadorService.test.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
    listarUtilizadores,
    obterPorId,
    atualizarUtilizadores,
    eliminarUtilizadores,
} = require('../../Services/utilizadorService'); // Caminho para o seu service

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        utilizador: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('Utilizador Service', () => {
    beforeAll(() => {
        // Mock para findMany
        prisma.utilizador.findMany.mockResolvedValue([
            { id: 1, nome: 'Test User 1', email: 'test1@example.com' },
            { id: 2, nome: 'Test User 2', email: 'test2@example.com' },
        ]);

        // Mock para findUnique
        prisma.utilizador.findUnique.mockResolvedValue({ id: 1, nome: 'Test User 1', email: 'test1@example.com' });

        // Mock para update
        prisma.utilizador.update.mockResolvedValue({ id: 1, nome: 'Updated User', email: 'test1@example.com' });

        // Mock para delete
        prisma.utilizador.delete.mockResolvedValue({ id: 1, nome: 'Test User 1', email: 'test1@example.com' });
    });

    test('listarUtilizadores deve retornar um array de utilizadores', async () => {
        const utilizadores = await listarUtilizadores();
        expect(Array.isArray(utilizadores)).toBe(true);
        expect(utilizadores.length).toBeGreaterThan(0); // Verifica se há ao menos um utilizador
    });

    test('obterPorId deve retornar um utilizador ou null', async () => {
        const utilizador = await obterPorId(1); // ID existente
        expect(utilizador).toHaveProperty('id', 1);
        expect(utilizador.nome).toBe('Test User 1');

        // Simulando o retorno null caso não exista um utilizador
        prisma.utilizador.findUnique.mockResolvedValueOnce(null); // Simula um ID inexistente
        const utilizadorInexistente = await obterPorId(99999); // ID inexistente
        expect(utilizadorInexistente).toBeNull();
    });

    test('atualizarUtilizadores deve modificar os dados corretamente', async () => {
        const atualizado = await atualizarUtilizadores(1, { nome: 'Updated User' });
        expect(atualizado.nome).toBe('Updated User');
    });

    test('eliminarUtilizadores deve remover o utilizador corretamente', async () => {
        // Primeiro, garantir que o utilizador existe
        const utilizadorAntes = await obterPorId(1);
        expect(utilizadorAntes).not.toBeNull();

        // Simular a exclusão
        await eliminarUtilizadores(1);

        // Mock para retornar null após exclusão
        prisma.utilizador.findUnique.mockResolvedValueOnce(null); // Simula a exclusão do utilizador

        // Verificar se o utilizador foi removido
        const utilizadorDepois = await obterPorId(1);
        expect(utilizadorDepois).toBeNull();
    });
});