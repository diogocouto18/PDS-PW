// Importa o PrismaClient para interagir com a base de dados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importa as funções do serviço de anúncios que serão testadas
const {
    criarAnuncio,
    listarAnuncios,
    obterAnuncioPorId,
    encerrarAnuncio,
} = require('../../Services/anuncioService');

// Importa o serviço de notificações
const notificacaoService = require('../../Services/notificacaoService');

// Mock do PrismaClient para simular interações com a base de dados
jest.mock('@prisma/client', () => {
    const mAnuncio = {
        create: jest.fn(), // Mock para criar anúncios
        findMany: jest.fn(), // Mock para listar anúncios
        findUnique: jest.fn(), // Mock para obter um anúncio por ID
        update: jest.fn(), // Mock para atualizar anúncios
    };

    const mUtilizador = {
        findMany: jest.fn(), // Mock para listar utilizadores
    };

    const mPrismaClient = {
        anuncio: mAnuncio,
        utilizador: mUtilizador,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

// Mock do serviço de notificações
jest.mock('../../Services/notificacaoService'); // Mock para notificacaoService

// Suite de testes para o serviço de anúncios
describe('Anuncio Service', () => {
    // Dados simulados para os testes
    const mockData = {
        cargo: 'Desenvolvedor',
        descricao: 'Anúncio de vaga para desenvolvedor',
        id_administrador: 1,
        id_evento: 2,
        estado: 'Ativo',
    };

    const mockAnuncio = {
        id: 1,
        cargo: 'Desenvolvedor',
        descricao: 'Anúncio de vaga para desenvolvedor',
        id_administrador: 1,
        id_evento: 2,
        estado: 'Ativo',
    };

    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Teste para criar um novo anúncio e enviar notificações
    test('criarAnuncio deve criar um novo anúncio e enviar notificações', async () => {
        prisma.anuncio.create.mockResolvedValue(mockAnuncio);
        prisma.utilizador.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
        notificacaoService.criarNotificacao.mockResolvedValue(true);

        const anuncio = await criarAnuncio(mockData);

        // Verifica se o anúncio foi criado corretamente
        expect(anuncio).toEqual(mockAnuncio);
        expect(prisma.anuncio.create).toHaveBeenCalledWith({
            data: mockData,
        });

        // Verifica se as notificações foram enviadas
        expect(notificacaoService.criarNotificacao).toHaveBeenCalledTimes(2);
    });

    // Teste para listar todos os anúncios de um evento
    test('listarAnuncios deve retornar uma lista de anúncios', async () => {
        const mockAnuncios = [mockAnuncio];
        prisma.anuncio.findMany.mockResolvedValue(mockAnuncios);

        const anuncios = await listarAnuncios(mockData.id_evento);

        // Verifica se os anúncios foram listados corretamente
        expect(Array.isArray(anuncios)).toBe(true);
        expect(anuncios.length).toBeGreaterThan(0);
        expect(anuncios[0]).toEqual(mockAnuncio);
    });

    // Teste para obter um anúncio por ID
    test('obterAnuncioPorId deve retornar um anúncio ou null', async () => {
        // Mock para o caso de ID existente
        prisma.anuncio.findUnique.mockResolvedValueOnce(mockAnuncio);

        // Mock para o caso de ID inexistente
        prisma.anuncio.findUnique.mockResolvedValueOnce(null);

        const anuncioExistente = await obterAnuncioPorId(mockAnuncio.id);
        const anuncioInexistente = await obterAnuncioPorId(99999); // ID inexistente

        // Verifica se o anúncio existente foi retornado corretamente
        expect(anuncioExistente).toEqual(mockAnuncio);

        // Verifica se o retorno para o ID inexistente é null
        expect(anuncioInexistente).toBeNull();
    });

    // Teste para encerrar um anúncio
    test('encerrarAnuncio deve modificar o estado de um anúncio para "Terminado"', async () => {
        const mockAnuncioAtivo = { ...mockAnuncio, estado: 'Ativo' };
        prisma.anuncio.findUnique.mockResolvedValue(mockAnuncioAtivo);
        prisma.anuncio.update.mockResolvedValue({ ...mockAnuncioAtivo, estado: 'Terminado' });

        const anuncioEncerrado = await encerrarAnuncio(mockAnuncio.id);

        // Verifica se o estado do anúncio foi atualizado para "Terminado"
        expect(anuncioEncerrado.estado).toBe('Terminado');
        expect(prisma.anuncio.update).toHaveBeenCalledWith({
            where: { id: mockAnuncio.id },
            data: { estado: 'Terminado' },
        });
    });

    // Teste para lançar erro ao tentar encerrar um anúncio já encerrado
    test('encerrarAnuncio deve lançar erro se o anúncio já estiver encerrado', async () => {
        const mockAnuncioEncerrado = { ...mockAnuncio, estado: 'Terminado' };
        prisma.anuncio.findUnique.mockResolvedValue(mockAnuncioEncerrado);

        await expect(encerrarAnuncio(mockAnuncio.id)).rejects.toThrow(
            'Anúncio já está encerrado'
        );
    });
});