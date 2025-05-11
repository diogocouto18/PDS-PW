// Mock dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock para autenticação
    apenasAdministrador: (req, res, next) => next(), // Mock para autorização de administradores
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

// Suite de testes para as rotas /suportes
describe('Rotas /suportes (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota POST /suportes/artigos
    describe('POST /suportes/artigos', () => {
        it('devolve 201 e cria artigo', async () => {
            const mockArtigo = { id: 1, artigo: 'FAQ', descricao: 'Perguntas frequentes' };
            suporteService.criarArtigo.mockResolvedValue(mockArtigo);

            const res = await request(app)
                .post('/suportes/artigos')
                .send({ artigo: 'FAQ', descricao: 'Perguntas frequentes' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockArtigo);
            expect(suporteService.criarArtigo).toHaveBeenCalledWith({ artigo: 'FAQ', descricao: 'Perguntas frequentes' });
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

    // Testes para a rota GET /suportes/artigos
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

    // Testes para a rota GET /suportes/artigos/:id
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

    // Testes para a rota PUT /suportes/artigos/:id
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

    // Testes para a rota DELETE /suportes/artigos/:id
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