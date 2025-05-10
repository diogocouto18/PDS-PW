/**
 * src/Tests/RoutesControllers/suportes.test.js
 *
 * Testes de rota/controllers para Suporte (sem BD real),
 * mockando suporteService e ignorando autenticação.
 */

// Mock dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasAdministrador: (req, res, next) => next(),
}));

// Mock do service de suporte
jest.mock('../../Services/suporteService', () => ({
    criarArtigo: jest.fn(),
    listarArtigos: jest.fn(),
    obterArtigoPorId: jest.fn(),
    atualizarArtigo: jest.fn(),
    eliminarArtigo: jest.fn(),
}));
const suporteService = require('../../Services/suporteService');

const request = require('supertest');
const express = require('express');
const suportesRouter = require('../../Routes/suportes');

// Monta app Express isolada apenas com o router de suportes
const app = express();
app.use(express.json());
app.use('/suportes', suportesRouter);

describe('Rotas /suportes (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /suportes/artigos', () => {
        it('devolve 201 e cria artigo', async () => {
            const mockArtigo = { id: 1, artigo: 'FAQ', descricao: 'Perguntas frequentes' };
            suporteService.criarArtigo.mockResolvedValue(mockArtigo);

            const res = await request(app)
                .post('/suportes/artigos')
                .send({ artigo: 'FAQ', descricao: 'Perguntas frequentes' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockArtigo);
            expect(suporteService.criarArtigo)
                .toHaveBeenCalledWith({ artigo: 'FAQ', descricao: 'Perguntas frequentes' });
        });

        it('devolve 500 em caso de erro', async () => {
            suporteService.criarArtigo.mockRejectedValue(new Error('Erro criar'));

            const res = await request(app)
                .post('/suportes/artigos')
                .send({ artigo: 'X' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao criar artigo' });
        });
    });

    describe('GET /suportes/artigos', () => {
        it('devolve 200 e lista de artigos', async () => {
            const mockList = [{ id: 2, artigo: 'Guia', descricao: 'Como usar' }];
            suporteService.listarArtigos.mockResolvedValue(mockList);

            const res = await request(app).get('/suportes/artigos');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);
            expect(suporteService.listarArtigos).toHaveBeenCalled();
        });

        it('devolve 500 em caso de erro', async () => {
            suporteService.listarArtigos.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/suportes/artigos');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao listar artigos de suporte' });
        });
    });

    describe('GET /suportes/artigos/:id', () => {
        it('devolve 200 e artigo existente', async () => {
            const mockArtigo = { id: 3, artigo: 'Dica', descricao: 'Dica útil' };
            suporteService.obterArtigoPorId.mockResolvedValue(mockArtigo);

            const res = await request(app).get('/suportes/artigos/3');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockArtigo);
            expect(suporteService.obterArtigoPorId).toHaveBeenCalledWith('3');
        });

        it('devolve 404 se não existir', async () => {
            suporteService.obterArtigoPorId.mockResolvedValue(null);

            const res = await request(app).get('/suportes/artigos/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Artigo não encontrado' });
        });

        it('devolve 500 em caso de erro', async () => {
            suporteService.obterArtigoPorId.mockRejectedValue(new Error('Erro buscar'));

            const res = await request(app).get('/suportes/artigos/3');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao obter artigo' });
        });
    });

    describe('PUT /suportes/artigos/:id', () => {
        it('devolve 200 e artigo atualizado', async () => {
            const mockUpdated = { id: 4, artigo: 'FAQ', descricao: 'Atualizado' };
            suporteService.atualizarArtigo.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/suportes/artigos/4')
                .send({ descricao: 'Atualizado' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);
            expect(suporteService.atualizarArtigo).toHaveBeenCalledWith('4', { descricao: 'Atualizado' });
        });

        it('devolve 500 em caso de erro', async () => {
            suporteService.atualizarArtigo.mockRejectedValue(new Error('Erro update'));

            const res = await request(app)
                .put('/suportes/artigos/4')
                .send({ descricao: 'X' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao atualizar artigo' });
        });
    });

    describe('DELETE /suportes/artigos/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            suporteService.eliminarArtigo.mockResolvedValue();

            const res = await request(app).delete('/suportes/artigos/5');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Artigo eliminado com sucesso' });
            expect(suporteService.eliminarArtigo).toHaveBeenCalledWith('5');
        });

        it('devolve 500 em caso de erro', async () => {
            suporteService.eliminarArtigo.mockRejectedValue(new Error('Erro delete'));

            const res = await request(app).delete('/suportes/artigos/5');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao eliminar artigo' });
        });
    });
});
