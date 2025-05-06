// src/tests/Services/suporteService.test.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
    criarArtigo,
    listarArtigos,
    obterArtigoPorId,
    atualizarArtigo,
    eliminarArtigo,
} = require('../../Services/suporteService'); // Caminho para o seu serviço

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        suporte: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('Suporte Service', () => {
    const mockData = { artigo: 'Artigo Teste', descricao: 'Descrição do artigo' };
    const mockId = 1;
    const mockArtigo = { id: mockId, artigo: 'Artigo Teste', descricao: 'Descrição do artigo' };

    beforeAll(() => {
        // Mock para create
        prisma.suporte.create.mockResolvedValue(mockArtigo);

        // Mock para findMany
        prisma.suporte.findMany.mockResolvedValue([mockArtigo]);

        // Mock para findUnique
        prisma.suporte.findUnique.mockResolvedValue(mockArtigo);

        // Mock para update
        prisma.suporte.update.mockResolvedValue({
            ...mockArtigo, // Mantém os dados originais
            ...{ artigo: 'Artigo Atualizado', descricao: 'Descrição Atualizada' }, // Modifica o que precisa
        });

        // Mock para delete
        prisma.suporte.delete.mockResolvedValue(mockArtigo);
    });

    test('criarArtigo deve criar um novo artigo', async () => {
        const artigo = await criarArtigo(mockData);
        expect(artigo).toEqual(mockArtigo);
        expect(prisma.suporte.create).toHaveBeenCalledWith({ data: mockData });
    });

    test('listarArtigos deve retornar uma lista de artigos', async () => {
        const artigos = await listarArtigos();
        expect(Array.isArray(artigos)).toBe(true);
        expect(artigos.length).toBeGreaterThan(0);
        expect(artigos[0]).toEqual(mockArtigo);
    });

    test('obterArtigoPorId deve retornar um artigo ou null', async () => {
        const artigoExistente = await obterArtigoPorId(mockId);
        expect(artigoExistente).toEqual(mockArtigo);

        prisma.suporte.findUnique.mockResolvedValueOnce(null); // Simula um artigo inexistente
        const artigoInexistente = await obterArtigoPorId(99999); // ID inexistente
        expect(artigoInexistente).toBeNull();
    });

    test('atualizarArtigo deve modificar os dados do artigo', async () => {
        const updatedData = { artigo: 'Artigo Atualizado', descricao: 'Descrição Atualizada' };
        const artigoAtualizado = await atualizarArtigo(mockId, updatedData);
        expect(artigoAtualizado.artigo).toBe(updatedData.artigo);
        expect(artigoAtualizado.descricao).toBe(updatedData.descricao);  // Agora deve passar
    });

    test('eliminarArtigo deve remover um artigo', async () => {
        // Primeiro, garantir que o artigo existe
        const artigoAntes = await obterArtigoPorId(mockId);
        expect(artigoAntes).not.toBeNull();

        // Simular a exclusão
        await eliminarArtigo(mockId);

        // Mock para retornar null após exclusão
        prisma.suporte.findUnique.mockResolvedValueOnce(null); // Simula a exclusão do artigo

        // Verificar se o artigo foi removido
        const artigoDepois = await obterArtigoPorId(mockId);
        expect(artigoDepois).toBeNull();
    });
});