const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const categoriaEventoService = require('../../Services/categoriaEventoService');

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
    const mCategoriaEvento = {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mPrismaClient = {
        categoriaEvento: mCategoriaEvento,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

describe('CategoriaEvento Service', () => {
    const mockData = { nome: 'Categoria Teste' };
    const mockCategoria = { id: 1, nome: 'Categoria Teste' };
    const mockId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('criar deve criar uma nova categoria', async () => {
        prisma.categoriaEvento.create.mockResolvedValue(mockCategoria);

        const categoria = await categoriaEventoService.criar(mockData);

        expect(categoria).toEqual(mockCategoria);
        expect(prisma.categoriaEvento.create).toHaveBeenCalledWith({
            data: mockData,
        });
    });

    test('obterTodos deve retornar uma lista de categorias', async () => {
        prisma.categoriaEvento.findMany.mockResolvedValue([mockCategoria]);

        const categorias = await categoriaEventoService.obterTodos();

        expect(Array.isArray(categorias)).toBe(true);
        expect(categorias.length).toBeGreaterThan(0);
        expect(categorias[0]).toEqual(mockCategoria);
    });

    test('obterPorId deve retornar uma categoria ou null', async () => {
        // Simulando o retorno para um ID existente
        prisma.categoriaEvento.findUnique.mockResolvedValue(mockCategoria);

        // Verificando o retorno para ID existente
        const categoriaExistente = await categoriaEventoService.obterPorId(mockId);
        expect(categoriaExistente).toEqual(mockCategoria);

        // Simulando o retorno para um ID inexistente
        prisma.categoriaEvento.findUnique.mockResolvedValueOnce(null); // Para o ID inexistente
        const categoriaInexistente = await categoriaEventoService.obterPorId(99999);
        expect(categoriaInexistente).toBeNull();
    });

    test('atualizar deve modificar os dados da categoria', async () => {
        const updatedData = { nome: 'Categoria Atualizada' };
        prisma.categoriaEvento.update.mockResolvedValue({ ...mockCategoria, nome: updatedData.nome });

        const categoriaAtualizada = await categoriaEventoService.atualizar(mockId, updatedData);

        expect(categoriaAtualizada.nome).toBe(updatedData.nome);
    });

    test('eliminar deve remover uma categoria', async () => {
        prisma.categoriaEvento.delete.mockResolvedValue(mockCategoria);

        const categoriaRemovida = await categoriaEventoService.eliminar(mockId);

        expect(categoriaRemovida).toEqual(mockCategoria);
        expect(prisma.categoriaEvento.delete).toHaveBeenCalledWith({
            where: { id: mockId },
        });
    });
});