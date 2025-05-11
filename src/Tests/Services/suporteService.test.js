// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa as funções do serviço de suporte que serão testadas
const {
    criarArtigo,
    listarArtigos,
    obterArtigoPorId,
    atualizarArtigo,
    eliminarArtigo,
} = require('../../Services/suporteService'); // Caminho para o ficheiro do serviço

// Cria um mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        suporte: {
            create: jest.fn(), // Mock para criar um artigo
            findMany: jest.fn(), // Mock para listar artigos
            findUnique: jest.fn(), // Mock para obter um artigo por ID
            update: jest.fn(), // Mock para atualizar um artigo
            delete: jest.fn(), // Mock para eliminar um artigo
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Suite de testes para o serviço de suporte
describe('Suporte Service', () => {
    // Dados de teste simulados
    const mockData = { artigo: 'Artigo Teste', descricao: 'Descrição do artigo' }; // Dados para criar um artigo
    const mockId = 1; // ID de teste
    const mockArtigo = { id: mockId, artigo: 'Artigo Teste', descricao: 'Descrição do artigo' }; // Artigo simulado

    // Configuração inicial antes de todos os testes
    beforeAll(() => {
        // Mock para o método create (criar artigo)
        prisma.suporte.create.mockResolvedValue(mockArtigo);

        // Mock para o método findMany (listar artigos)
        prisma.suporte.findMany.mockResolvedValue([mockArtigo]);

        // Mock para o método findUnique (obter artigo por ID)
        prisma.suporte.findUnique.mockResolvedValue(mockArtigo);

        // Mock para o método update (atualizar artigo)
        prisma.suporte.update.mockResolvedValue({
            ...mockArtigo, // Mantém os dados originais
            ...{ artigo: 'Artigo Atualizado', descricao: 'Descrição Atualizada' }, // Modifica os dados
        });

        // Mock para o método delete (eliminar artigo)
        prisma.suporte.delete.mockResolvedValue(mockArtigo);
    });

    // Teste para criar um novo artigo
    test('criarArtigo deve criar um novo artigo', async () => {
        const artigo = await criarArtigo(mockData); // Chama a função com os dados simulados
        expect(artigo).toEqual(mockArtigo); // Verifica se o artigo criado corresponde ao mock
        expect(prisma.suporte.create).toHaveBeenCalledWith({ data: mockData }); // Verifica se o método foi chamado corretamente
    });

    // Teste para listar todos os artigos
    test('listarArtigos deve retornar uma lista de artigos', async () => {
        const artigos = await listarArtigos(); // Chama a função para listar artigos
        expect(Array.isArray(artigos)).toBe(true); // Verifica se o retorno é um array
        expect(artigos.length).toBeGreaterThan(0); // Verifica se há pelo menos um artigo
        expect(artigos[0]).toEqual(mockArtigo); // Verifica se o primeiro artigo corresponde ao mock
    });

    // Teste para obter um artigo por ID
    test('obterArtigoPorId deve retornar um artigo ou null', async () => {
        const artigoExistente = await obterArtigoPorId(mockId); // Testa com um ID existente
        expect(artigoExistente).toEqual(mockArtigo); // Verifica se o artigo corresponde ao mock

        // Simula o retorno null para um ID inexistente
        prisma.suporte.findUnique.mockResolvedValueOnce(null); // Mock para ID inexistente
        const artigoInexistente = await obterArtigoPorId(99999); // Testa com um ID inexistente
        expect(artigoInexistente).toBeNull(); // Verifica se o retorno é null
    });

    // Teste para atualizar os dados de um artigo
    test('atualizarArtigo deve modificar os dados do artigo', async () => {
        const updatedData = { artigo: 'Artigo Atualizado', descricao: 'Descrição Atualizada' }; // Dados atualizados
        const artigoAtualizado = await atualizarArtigo(mockId, updatedData); // Atualiza o artigo
        expect(artigoAtualizado.artigo).toBe(updatedData.artigo); // Verifica se o título foi atualizado
        expect(artigoAtualizado.descricao).toBe(updatedData.descricao); // Verifica se a descrição foi atualizada
    });

    // Teste para eliminar um artigo
    test('eliminarArtigo deve remover um artigo', async () => {
        // Primeiro, verifica se o artigo existe antes da eliminação
        const artigoAntes = await obterArtigoPorId(mockId);
        expect(artigoAntes).not.toBeNull(); // Verifica que o artigo existe

        // Simula a exclusão do artigo
        await eliminarArtigo(mockId);

        // Mock para retornar null após a exclusão
        prisma.suporte.findUnique.mockResolvedValueOnce(null); // Simula que o artigo foi eliminado

        // Verifica se o artigo foi removido
        const artigoDepois = await obterArtigoPorId(mockId);
        expect(artigoDepois).toBeNull(); // Verifica que o artigo já não existe
    });
});