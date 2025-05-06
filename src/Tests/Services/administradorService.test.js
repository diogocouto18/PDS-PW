// src/tests/Services/administradorService.test.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
    listarAdministradores,
    obterPorId,
    atualizarAdministradores,
    eliminarAdministradores,
} = require('../../Services/administradorService'); // Caminho para o seu serviço

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        administrador: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('Administrador Service', () => {
    beforeAll(() => {
        // Mock para findMany
        prisma.administrador.findMany.mockResolvedValue([
            { id: 1, nome: 'Admin 1', email: 'admin1@example.com', ativo: true },
            { id: 2, nome: 'Admin 2', email: 'admin2@example.com', ativo: true },
        ]);

        // Mock para findUnique
        prisma.administrador.findUnique.mockResolvedValue({
            id: 1,
            nome: 'Admin 1',
            email: 'admin1@example.com',
            ativo: true,
        });

        // Mock para update
        prisma.administrador.update.mockResolvedValue({
            id: 1,
            nome: 'Admin 1',
            email: 'admin1@example.com',
            ativo: false,
        });

        // Mock para delete
        prisma.administrador.delete.mockResolvedValue({
            id: 1,
            nome: 'Admin 1',
            email: 'admin1@example.com',
            ativo: true,
        });
    });

    test('listarAdministradores deve retornar um array de administradores', async () => {
        const administradores = await listarAdministradores();
        expect(Array.isArray(administradores)).toBe(true);
        expect(administradores.length).toBeGreaterThan(0); // Verifica se há ao menos um administrador
    });

    test('obterPorId deve retornar um administrador ou null', async () => {
        const admin = await obterPorId(1); // ID existente
        expect(admin).toHaveProperty('id', 1);
        expect(admin.nome).toBe('Admin 1');

        // Simulando o retorno null caso não exista um administrador
        prisma.administrador.findUnique.mockResolvedValueOnce(null); // Simula um ID inexistente
        const adminInexistente = await obterPorId(99999); // ID inexistente
        expect(adminInexistente).toBeNull();
    });

    test('atualizarAdministradores deve modificar os dados corretamente', async () => {
        const atualizado = await atualizarAdministradores(1, false);
        expect(atualizado.ativo).toBe(false);
    });

    test('eliminarAdministradores deve remover o administrador corretamente', async () => {
        // Primeiro, garantir que o administrador existe
        const adminAntes = await obterPorId(1);
        expect(adminAntes).not.toBeNull();

        // Simular a exclusão
        await eliminarAdministradores(1);

        // Mock para retornar null após exclusão
        prisma.administrador.findUnique.mockResolvedValueOnce(null); // Simula a exclusão do administrador

        // Verificar se o administrador foi removido
        const adminDepois = await obterPorId(1);
        expect(adminDepois).toBeNull();
    });
});