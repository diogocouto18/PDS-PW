const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
    criarAnuncio,
    listarAnuncios,
    obterAnuncioPorId,
    encerrarAnuncio
} = require('../../Services/anuncioService');
const notificacaoService = require('../../Services/notificacaoService');

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
    const mAnuncio = {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    };

    const mUtilizador = {
        findMany: jest.fn(),
    };

    const mPrismaClient = {
        anuncio: mAnuncio,
        utilizador: mUtilizador,
    };

    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

jest.mock('../../Services/notificacaoService'); // Mock para notificacaoService

describe('Anuncio Service', () => {
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

    beforeEach(() => {
        // Resetar os mocks antes de cada teste
        jest.clearAllMocks();
    });

    test('criarAnuncio deve criar um novo anúncio e enviar notificações', async () => {
        prisma.anuncio.create.mockResolvedValue(mockAnuncio);
        prisma.utilizador.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
        notificacaoService.criarNotificacao.mockResolvedValue(true);

        const anuncio = await criarAnuncio(mockData);

        expect(anuncio).toEqual(mockAnuncio);
        expect(prisma.anuncio.create).toHaveBeenCalledWith({
            data: mockData,
        });
        expect(notificacaoService.criarNotificacao).toHaveBeenCalledTimes(2);
    });

    test('listarAnuncios deve retornar uma lista de anúncios', async () => {
        const mockAnuncios = [mockAnuncio];
        prisma.anuncio.findMany.mockResolvedValue(mockAnuncios);

        const anuncios = await listarAnuncios(mockData.id_evento);
        expect(Array.isArray(anuncios)).toBe(true);
        expect(anuncios.length).toBeGreaterThan(0);
        expect(anuncios[0]).toEqual(mockAnuncio);
    });

    test('obterAnuncioPorId deve retornar um anúncio ou null', async () => {
        // Mock para o caso de ID existente
        prisma.anuncio.findUnique.mockResolvedValueOnce(mockAnuncio);
        // Mock para o caso de ID inexistente
        prisma.anuncio.findUnique.mockResolvedValueOnce(null);

        const anuncioExistente = await obterAnuncioPorId(mockAnuncio.id);
        const anuncioInexistente = await obterAnuncioPorId(99999); // ID inexistente

        expect(anuncioExistente).toEqual(mockAnuncio);
        expect(anuncioInexistente).toBeNull();
    });

    test('encerrarAnuncio deve modificar o estado de um anúncio para "Terminado"', async () => {
        const mockAnuncioAtivo = { ...mockAnuncio, estado: 'Ativo' };
        prisma.anuncio.findUnique.mockResolvedValue(mockAnuncioAtivo);
        prisma.anuncio.update.mockResolvedValue({ ...mockAnuncioAtivo, estado: 'Terminado' });

        const anuncioEncerrado = await encerrarAnuncio(mockAnuncio.id);
        expect(anuncioEncerrado.estado).toBe('Terminado');
        expect(prisma.anuncio.update).toHaveBeenCalledWith({
            where: { id: mockAnuncio.id },
            data: { estado: 'Terminado' },
        });
    });

    test('encerrarAnuncio deve lançar erro se o anúncio já estiver encerrado', async () => {
        const mockAnuncioEncerrado = { ...mockAnuncio, estado: 'Terminado' };
        prisma.anuncio.findUnique.mockResolvedValue(mockAnuncioEncerrado);

        await expect(encerrarAnuncio(mockAnuncio.id)).rejects.toThrow(
            'Anúncio já está encerrado'
        );
    });
});