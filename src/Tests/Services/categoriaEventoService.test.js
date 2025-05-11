// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa o serviço de categorias de eventos que será testado
const categoriaEventoService = require('../../Services/categoriaEventoService');

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mCategoriaEvento = {
        create: jest.fn(), // Mock para criar categorias
        findMany: jest.fn(), // Mock para listar categorias
        findUnique: jest.fn(), // Mock para obter uma categoria por ID
        update: jest.fn(), // Mock para atualizar categorias
        delete: jest.fn(), // Mock para eliminar categorias
    };

    const mPrismaClient = {
        categoriaEvento: mCategoriaEvento,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

// Suite de testes para o serviço de categorias de eventos
describe('CategoriaEvento Service', () => {
    // Dados simulados para os testes
    const mockData = { nome: 'Categoria Teste' };
    const mockCategoria = { id: 1, nome: 'Categoria Teste' };
    const mockId = 1;

    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Teste para criar uma nova categoria
    test('criar deve criar uma nova categoria', async () => {
        prisma.categoriaEvento.create.mockResolvedValue(mockCategoria);

        const categoria = await categoriaEventoService.criar(mockData);

        // Verifica se a categoria foi criada corretamente
        expect(categoria).toEqual(mockCategoria);
        expect(prisma.categoriaEvento.create).toHaveBeenCalledWith({
            data: mockData,
        });
    });

    // Teste para listar todas as categorias
    test('obterTodos deve retornar uma lista de categorias', async () => {
        prisma.categoriaEvento.findMany.mockResolvedValue([mockCategoria]);

        const categorias = await categoriaEventoService.obterTodos();

        // Verifica se as categorias foram listadas corretamente
        expect(Array.isArray(categorias)).toBe(true);
        expect(categorias.length).toBeGreaterThan(0);
        expect(categorias[0]).toEqual(mockCategoria);
    });

    // Teste para obter uma categoria por ID
    test('obterPorId deve retornar uma categoria ou null', async () => {
        // Simula o retorno para um ID existente
        prisma.categoriaEvento.findUnique.mockResolvedValue(mockCategoria);

        // Verifica o retorno para ID existente
        const categoriaExistente = await categoriaEventoService.obterPorId(mockId);
        expect(categoriaExistente).toEqual(mockCategoria);

        // Simula o retorno para um ID inexistente
        prisma.categoriaEvento.findUnique.mockResolvedValueOnce(null);
        const categoriaInexistente = await categoriaEventoService.obterPorId(99999);
        expect(categoriaInexistente).toBeNull(); // Verifica se o retorno é null
    });

    // Teste para atualizar uma categoria
    test('atualizar deve modificar os dados da categoria', async () => {
        const updatedData = { nome: 'Categoria Atualizada' };
        prisma.categoriaEvento.update.mockResolvedValue({ ...mockCategoria, nome: updatedData.nome });

        const categoriaAtualizada = await categoriaEventoService.atualizar(mockId, updatedData);

        // Verifica se os dados foram atualizados corretamente
        expect(categoriaAtualizada.nome).toBe(updatedData.nome);
        expect(prisma.categoriaEvento.update).toHaveBeenCalledWith({
            where: { id: mockId },
            data: updatedData,
        });
    });

    // Teste para eliminar uma categoria
    test('eliminar deve remover uma categoria', async () => {
        prisma.categoriaEvento.delete.mockResolvedValue(mockCategoria);

        const categoriaRemovida = await categoriaEventoService.eliminar(mockId);

        // Verifica se a categoria foi removida corretamente
        expect(categoriaRemovida).toEqual(mockCategoria);
        expect(prisma.categoriaEvento.delete).toHaveBeenCalledWith({
            where: { id: mockId },
        });
    });
});