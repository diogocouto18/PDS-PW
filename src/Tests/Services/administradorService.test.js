// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa as funções do serviço de administradores que serão testadas
const {
    listarAdministradores,
    obterPorId,
    atualizarAdministradores,
    eliminarAdministradores,
} = require('../../Services/administradorService'); // Caminho para o serviço

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        administrador: {
            findMany: jest.fn(), // Mock para listar administradores
            findUnique: jest.fn(), // Mock para obter um administrador por ID
            update: jest.fn(), // Mock para atualizar administradores
            delete: jest.fn(), // Mock para remover administradores
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Suite de testes para o serviço de administradores
describe('Administrador Service', () => {
    // Configuração inicial antes de todos os testes
    beforeAll(() => {
        // Mock para findMany - Lista de administradores
        prisma.administrador.findMany.mockResolvedValue([
            { id: 1, nome: 'Admin 1', email: 'admin1@example.com', ativo: true },
            { id: 2, nome: 'Admin 2', email: 'admin2@example.com', ativo: true },
        ]);

        // Mock para findUnique - Retorna um administrador específico
        prisma.administrador.findUnique.mockResolvedValue({
            id: 1,
            nome: 'Admin 1',
            email: 'admin1@example.com',
            ativo: true,
        });

        // Mock para update - Atualização de administrador
        prisma.administrador.update.mockResolvedValue({
            id: 1,
            nome: 'Admin 1',
            email: 'admin1@example.com',
            ativo: false,
        });

        // Mock para delete - Exclusão de administrador
        prisma.administrador.delete.mockResolvedValue({
            id: 1,
            nome: 'Admin 1',
            email: 'admin1@example.com',
            ativo: true,
        });
    });

    // Teste para listar administradores
    test('listarAdministradores deve retornar um array de administradores', async () => {
        const administradores = await listarAdministradores();

        // Verifica se o retorno é um array e contém pelo menos um administrador
        expect(Array.isArray(administradores)).toBe(true);
        expect(administradores.length).toBeGreaterThan(0);
        expect(administradores[0]).toHaveProperty('id');
    });

    // Teste para obter um administrador por ID
    test('obterPorId deve retornar um administrador ou null', async () => {
        // Testa com um ID existente
        const admin = await obterPorId(1);
        expect(admin).toHaveProperty('id', 1);
        expect(admin.nome).toBe('Admin 1');

        // Simula o retorno null para um ID inexistente
        prisma.administrador.findUnique.mockResolvedValueOnce(null);
        const adminInexistente = await obterPorId(99999);
        expect(adminInexistente).toBeNull();
    });

    // Teste para atualizar os dados de um administrador
    test('atualizarAdministradores deve modificar os dados corretamente', async () => {
        const atualizado = await atualizarAdministradores(1, false);

        // Verifica se o estado "ativo" foi atualizado corretamente
        expect(atualizado.ativo).toBe(false);
        expect(prisma.administrador.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { ativo: false },
        });
    });

    // Teste para remover um administrador
    test('eliminarAdministradores deve remover o administrador corretamente', async () => {
        // Primeiro, verifica se o administrador existe antes da exclusão
        const adminAntes = await obterPorId(1);
        expect(adminAntes).not.toBeNull();

        // Simula a exclusão do administrador
        await eliminarAdministradores(1);

        // Mock para retornar null após a exclusão
        prisma.administrador.findUnique.mockResolvedValueOnce(null);

        // Verifica se o administrador foi removido
        const adminDepois = await obterPorId(1);
        expect(adminDepois).toBeNull();
    });
});