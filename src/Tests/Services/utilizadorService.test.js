// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa as funções do serviço de utilizadores que serão testadas
const {
    listarUtilizadores,
    obterPorId,
    atualizarUtilizadores,
    eliminarUtilizadores,
} = require('../../Services/utilizadorService'); // Caminho para o ficheiro do serviço

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        utilizador: {
            findMany: jest.fn(), // Mock para listar utilizadores
            findUnique: jest.fn(), // Mock para obter utilizador por ID
            update: jest.fn(), // Mock para atualizar utilizador
            delete: jest.fn(), // Mock para eliminar utilizador
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Suite de testes para o serviço de utilizadores
describe('Utilizador Service', () => {
    // Configuração inicial antes de todos os testes
    beforeAll(() => {
        // Mock para o método findMany (listar utilizadores)
        prisma.utilizador.findMany.mockResolvedValue([
            { id: 1, nome: 'Test User 1', email: 'test1@example.com' },
            { id: 2, nome: 'Test User 2', email: 'test2@example.com' },
        ]);

        // Mock para o método findUnique (obter utilizador por ID)
        prisma.utilizador.findUnique.mockResolvedValue({ id: 1, nome: 'Test User 1', email: 'test1@example.com' });

        // Mock para o método update (atualizar utilizador)
        prisma.utilizador.update.mockResolvedValue({ id: 1, nome: 'Updated User', email: 'test1@example.com' });

        // Mock para o método delete (eliminar utilizador)
        prisma.utilizador.delete.mockResolvedValue({ id: 1, nome: 'Test User 1', email: 'test1@example.com' });
    });

    // Teste para listar utilizadores
    test('listarUtilizadores deve retornar um array de utilizadores', async () => {
        const utilizadores = await listarUtilizadores();
        expect(Array.isArray(utilizadores)).toBe(true); // Verifica se o retorno é um array
        expect(utilizadores.length).toBeGreaterThan(0); // Verifica se há pelo menos um utilizador
    });

    // Teste para obter um utilizador por ID
    test('obterPorId deve retornar um utilizador ou null', async () => {
        const utilizador = await obterPorId(1); // Testa com um ID existente
        expect(utilizador).toHaveProperty('id', 1); // Verifica se o ID corresponde
        expect(utilizador.nome).toBe('Test User 1'); // Verifica o nome do utilizador

        // Simula o retorno null para um ID inexistente
        prisma.utilizador.findUnique.mockResolvedValueOnce(null); // Mock para ID inexistente
        const utilizadorInexistente = await obterPorId(99999); // Testa com um ID inexistente
        expect(utilizadorInexistente).toBeNull(); // Verifica se o retorno é null
    });

    // Teste para atualizar os dados de um utilizador
    test('atualizarUtilizadores deve modificar os dados corretamente', async () => {
        const atualizado = await atualizarUtilizadores(1, { nome: 'Updated User' }); // Atualiza o nome do utilizador
        expect(atualizado.nome).toBe('Updated User'); // Verifica se o nome foi atualizado
    });

    // Teste para eliminar um utilizador
    test('eliminarUtilizadores deve remover o utilizador corretamente', async () => {
        // Primeiro, verifica se o utilizador existe antes da eliminação
        const utilizadorAntes = await obterPorId(1);
        expect(utilizadorAntes).not.toBeNull(); // Verifica que o utilizador existe

        // Simula a exclusão do utilizador
        await eliminarUtilizadores(1);

        // Mock para retornar null após a exclusão
        prisma.utilizador.findUnique.mockResolvedValueOnce(null); // Simula que o utilizador foi eliminado

        // Verifica se o utilizador foi removido
        const utilizadorDepois = await obterPorId(1);
        expect(utilizadorDepois).toBeNull(); // Verifica que o utilizador já não existe
    });
});