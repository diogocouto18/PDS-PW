/**
 * src/Tests/RoutesControllers/avaliacoesEvento.test.js
 *
 * Testes de rota/controllers para Avaliações de Evento (sem BD real),
 * mockando avaliacaoEventoService e ignorando autenticação.
 */

// Mock dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasAdministrador: (req, res, next) => next(),
    apenasUtilizadores: (req, res, next) => next(),
    apenasProprioUtilizador: (req, res, next) => next()
}));

// Mock do service de avaliação de evento
jest.mock('../../Services/avaliacaoEventoService', () => ({
    criarAvaliacao: jest.fn(),
    listarPorEvento: jest.fn(),
    obterPorId: jest.fn(),
    atualizarAvaliacao: jest.fn(),
    eliminarAvaliacao: jest.fn(),
    mediaDoEvento: jest.fn(),
}));
const avaliacaoService = require('../../Services/avaliacaoEventoService');

const request = require('supertest');
const express = require('express');
const avaliacaoRouter = require('../../Routes/avaliacoesEvento');

// Monta app Express isolada apenas com o router de avaliações de evento
const app = express();
app.use(express.json());
// Injeta req.utilizador para endpoints que necessitam de user
app.use((req, res, next) => { req.utilizador = { id: 10 }; next(); });
app.use('/avaliacao-evento', avaliacaoRouter);

describe('Rotas /avaliacao-evento (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /avaliacao-evento', () => {
        it('devolve 201 e cria avaliação', async () => {
            const mockAval = { id: 1, id_utilizador: 10, id_evento: 2, nota: 5 };
            avaliacaoService.criarAvaliacao.mockResolvedValue(mockAval);

            const res = await request(app)
                .post('/avaliacao-evento')
                .send({ id_evento: 2, nota: 5 });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockAval);
            expect(avaliacaoService.criarAvaliacao)
                .toHaveBeenCalledWith({ id_utilizador: 10, id_evento: 2, nota: 5 });
        });

        it('devolve 400 em caso de erro de validação', async () => {
            avaliacaoService.criarAvaliacao.mockRejectedValue(new Error('Nota inválida'));

            const res = await request(app)
                .post('/avaliacao-evento')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Nota inválida' });
        });
    });

    describe('GET /avaliacao-evento/evento/:id_evento', () => {
        it('devolve 200 e lista de avaliações', async () => {
            const mockList = [ { id:1, nota:5 }, { id:2, nota:4 } ];
            avaliacaoService.listarPorEvento.mockResolvedValue(mockList);

            const res = await request(app).get('/avaliacao-evento/evento/3');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);
            expect(avaliacaoService.listarPorEvento).toHaveBeenCalledWith('3');
        });

        it('devolve 500 em caso de erro', async () => {
            avaliacaoService.listarPorEvento.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/avaliacao-evento/evento/3');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao listar avaliações' });
        });
    });

    describe('PUT /avaliacao-evento/:id', () => {
        it('devolve 404 se não existir', async () => {
            avaliacaoService.obterPorId.mockResolvedValue(null);

            const res = await request(app)
                .put('/avaliacao-evento/5')
                .send({ nota: 3 });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Avaliação não encontrada' });
        });

        it('devolve 403 se for de outro utilizador', async () => {
            avaliacaoService.obterPorId.mockResolvedValue({ id_utilizador: 2 });

            const res = await request(app)
                .put('/avaliacao-evento/5')
                .send({ nota: 3 });

            expect(res.status).toBe(403);
            expect(res.body).toEqual({ error: 'Só podes atualizar a tua própria avaliação' });
        });

        it('devolve 200 e avaliação atualizada', async () => {
            avaliacaoService.obterPorId.mockResolvedValue({ id_utilizador: 10 });
            const mockUpdated = { id: 5, nota: 3 };
            avaliacaoService.atualizarAvaliacao.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/avaliacao-evento/5')
                .send({ nota: 3 });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);
            expect(avaliacaoService.atualizarAvaliacao)
                .toHaveBeenCalledWith('5', { nota: 3 });
        });

        it('devolve 400 em caso de erro de atualização', async () => {
            avaliacaoService.obterPorId.mockResolvedValue({ id_utilizador: 10 });
            avaliacaoService.atualizarAvaliacao.mockRejectedValue(new Error('Erro update'));

            const res = await request(app)
                .put('/avaliacao-evento/5')
                .send({ nota: 3 });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erro update' });
        });
    });

    describe('DELETE /avaliacao-evento/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            avaliacaoService.eliminarAvaliacao.mockResolvedValue();

            const res = await request(app).delete('/avaliacao-evento/6');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Avaliação removida com sucesso' });
            expect(avaliacaoService.eliminarAvaliacao).toHaveBeenCalledWith('6');
        });

        it('devolve 500 em caso de erro', async () => {
            avaliacaoService.eliminarAvaliacao.mockRejectedValue(new Error('Erro delete'));

            const res = await request(app).delete('/avaliacao-evento/6');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro delete' });
        });
    });

    describe('GET /avaliacao-evento/evento/:id_evento/media', () => {
        it('devolve 200 e média', async () => {
            avaliacaoService.mediaDoEvento.mockResolvedValue(4.2);

            const res = await request(app).get('/avaliacao-evento/evento/8/media');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ media: 4.2 });
            expect(avaliacaoService.mediaDoEvento).toHaveBeenCalledWith('8');
        });

        it('devolve 500 em caso de erro', async () => {
            avaliacaoService.mediaDoEvento.mockRejectedValue(new Error('Erro media'));

            const res = await request(app).get('/avaliacao-evento/evento/8/media');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao calcular média' });
        });
    });
});
