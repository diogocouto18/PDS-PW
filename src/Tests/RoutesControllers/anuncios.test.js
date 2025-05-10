/**
 * src/Tests/RoutesControllers/anuncios.test.js
 *
 * Testes de rota/controllers para Anúncios (sem BD real),
 * mockando anuncioService e ignorando autenticação.
 */

// Mocks dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasAdministrador: (req, res, next) => next()
}));

// Mock do service de anúncios
jest.mock('../../Services/anuncioService', () => ({
    criarAnuncio: jest.fn(),
    listarAnuncios: jest.fn(),
    obterAnuncioPorId: jest.fn(),
    encerrarAnuncio: jest.fn(),
}));

const request = require('supertest');
const express = require('express');
const anuncioService = require('../../Services/anuncioService');
const anunciosRouter = require('../../Routes/anuncios');

// Monta app Express isolada apenas com o router de anúncios
const app = express();
app.use(express.json());
// Injeta req.utilizador para o POST
app.use((req, res, next) => { req.utilizador = { id: 7 }; next(); });
app.use('/anuncios', anunciosRouter);

describe('Rotas /anuncios (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /anuncios', () => {
        it('devolve 201 e cria anúncio', async () => {
            const mockAnuncio = { id: 1, cargo: 'Voluntário', id_administrador: 7 };
            anuncioService.criarAnuncio.mockResolvedValue(mockAnuncio);

            const res = await request(app)
                .post('/anuncios')
                .send({ cargo: 'Voluntário', descricao: 'Descrição' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockAnuncio);
            expect(anuncioService.criarAnuncio)
                .toHaveBeenCalledWith({ cargo: 'Voluntário', descricao: 'Descrição', id_administrador: 7 });
        });

        it('devolve 500 em caso de erro', async () => {
            anuncioService.criarAnuncio.mockRejectedValue(new Error('Erro criação'));

            const res = await request(app)
                .post('/anuncios')
                .send({ cargo: 'X' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao criar anúncio' });
        });
    });

    describe('GET /anuncios', () => {
        it('devolve 200 e lista de anúncios por evento', async () => {
            const mockList = [{ id: 2, cargo: 'Teste', id_evento: '3' }];
            anuncioService.listarAnuncios.mockResolvedValue(mockList);

            const res = await request(app).get('/anuncios?id_evento=3');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);
            expect(anuncioService.listarAnuncios).toHaveBeenCalledWith('3');
        });

        it('devolve 500 em caso de erro', async () => {
            anuncioService.listarAnuncios.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/anuncios?id_evento=3');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar anúncios' });
        });
    });

    describe('GET /anuncios/:id', () => {
        it('devolve 200 e anúncio existente', async () => {
            const mockAnuncio = { id: 5, cargo: 'Teste' };
            anuncioService.obterAnuncioPorId.mockResolvedValue(mockAnuncio);

            const res = await request(app).get('/anuncios/5');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockAnuncio);
            expect(anuncioService.obterAnuncioPorId).toHaveBeenCalledWith('5');
        });

        it('devolve 404 se não existir', async () => {
            anuncioService.obterAnuncioPorId.mockResolvedValue(null);

            const res = await request(app).get('/anuncios/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Anúncio não encontrado' });
        });

        it('devolve 500 em caso de erro', async () => {
            anuncioService.obterAnuncioPorId.mockRejectedValue(new Error('Erro buscar'));

            const res = await request(app).get('/anuncios/5');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar anúncio' });
        });
    });

    describe('PUT /anuncios/:id/encerrar', () => {
        it('devolve 200 e anúncio encerrado', async () => {
            const mockEnc = { id: 6, estado: 'Terminado' };
            anuncioService.encerrarAnuncio.mockResolvedValue(mockEnc);

            const res = await request(app).put('/anuncios/6/encerrar');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockEnc);
            expect(anuncioService.encerrarAnuncio).toHaveBeenCalledWith('6');
        });

        it('devolve 500 em caso de erro', async () => {
            anuncioService.encerrarAnuncio.mockRejectedValue(new Error('Erro encerrar'));

            const res = await request(app).put('/anuncios/7/encerrar');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao encerrar anúncio' });
        });
    });
});