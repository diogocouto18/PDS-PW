/**
 * src/Tests/RoutesControllers/candidaturaVoluntariado.test.js
 *
 * Testes de rota/controllers para Candidatura de Voluntariado (sem BD real),
 * mockando candidaturaVoluntariadoService e ignorando autenticação.
 */

// Mock dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasUtilizadores: (req, res, next) => next(),
    apenasAdministrador: (req, res, next) => next(),
    apenasProprioUtilizador: (req, res, next) => next(),
    proprioUtilizadorOuAdministrador: (req, res, next) => next(),
}));

// Mock do service de candidatura de voluntariado
jest.mock('../../Services/candidaturaVoluntariadoService', () => ({
    criarCandidatura: jest.fn(),
    avaliarCandidatura: jest.fn(),
    listarPorAnuncio: jest.fn(),
    listarMinhasCandidaturas: jest.fn(),
    removerCandidatura: jest.fn(),
}));
const candidaturaService = require('../../Services/candidaturaVoluntariadoService');

const request = require('supertest');
const express = require('express');
const candidaturaRouter = require('../../Routes/candidaturaVoluntariado');

// Monta app Express isolada apenas com o router de candidatura
const app = express();
app.use(express.json());
// Injeta req.utilizador.id para endpoints que necessitam de user
app.use((req, res, next) => { req.utilizador = { id: 42 }; next(); });
app.use('/candidaturaVoluntariado', candidaturaRouter);

describe('Rotas /candidaturaVoluntariado (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /candidaturaVoluntariado', () => {
        it('devolve 201 e cria candidatura', async () => {
            const mockCand = { id: 1, id_utilizador: 42, id_anuncio: 5, mensagem: 'Olá' };
            candidaturaService.criarCandidatura.mockResolvedValue(mockCand);

            const res = await request(app)
                .post('/candidaturaVoluntariado')
                .send({ id_anuncio: 5, mensagem: 'Olá' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockCand);
            expect(candidaturaService.criarCandidatura)
                .toHaveBeenCalledWith({ id_utilizador: 42, id_anuncio: 5, mensagem: 'Olá' });
        });

        it('devolve 500 em caso de erro', async () => {
            candidaturaService.criarCandidatura.mockRejectedValue(new Error('Erro criar'));

            const res = await request(app)
                .post('/candidaturaVoluntariado')
                .send({ id_anuncio: 1 });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro criar' });
        });
    });

    describe('PUT /candidaturaVoluntariado/:id/avaliar', () => {
        it('devolve 200 e avalia candidatura', async () => {
            const mockAval = { id: 2, estado: 'Aceite', id_administrador: 42 };
            candidaturaService.avaliarCandidatura.mockResolvedValue(mockAval);

            const res = await request(app)
                .put('/candidaturaVoluntariado/2/avaliar')
                .send({ estado: 'Aceite' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockAval);
            expect(candidaturaService.avaliarCandidatura)
                .toHaveBeenCalledWith('2', 'Aceite', 42);
        });

        it('devolve 500 em caso de erro', async () => {
            candidaturaService.avaliarCandidatura.mockRejectedValue(new Error('Erro avaliar'));

            const res = await request(app)
                .put('/candidaturaVoluntariado/3/avaliar')
                .send({ estado: 'Rejeitado' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro avaliar' });
        });
    });

    describe('GET /candidaturaVoluntariado/anuncio/:id_anuncio', () => {
        it('devolve 200 e lista de candidaturas', async () => {
            const mockList = [{ id:1, id_anuncio:7 }];
            candidaturaService.listarPorAnuncio.mockResolvedValue(mockList);

            const res = await request(app).get('/candidaturaVoluntariado/anuncio/7');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);
            expect(candidaturaService.listarPorAnuncio).toHaveBeenCalledWith('7');
        });

        it('devolve 500 em caso de erro', async () => {
            candidaturaService.listarPorAnuncio.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/candidaturaVoluntariado/anuncio/8');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar candidaturas' });
        });
    });

    describe('GET /candidaturaVoluntariado/minhas', () => {
        it('devolve 200 e lista de candidaturas do utilizador', async () => {
            const mockMinhas = [{ id:3, id_utilizador:42 }];
            candidaturaService.listarMinhasCandidaturas.mockResolvedValue(mockMinhas);

            const res = await request(app).get('/candidaturaVoluntariado/minhas');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMinhas);
            expect(candidaturaService.listarMinhasCandidaturas).toHaveBeenCalledWith(42);
        });

        it('devolve 500 em caso de erro', async () => {
            candidaturaService.listarMinhasCandidaturas.mockRejectedValue(new Error('Erro min'));

            const res = await request(app).get('/candidaturaVoluntariado/minhas');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro interno ao buscar candidaturas' });
        });
    });

    describe('DELETE /candidaturaVoluntariado/candidaturas/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            candidaturaService.removerCandidatura.mockResolvedValue();

            const res = await request(app).delete('/candidaturaVoluntariado/candidaturas/9');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Candidatura removida com sucesso' });
            expect(candidaturaService.removerCandidatura).toHaveBeenCalledWith('9');
        });

        it('devolve 500 em caso de erro', async () => {
            candidaturaService.removerCandidatura.mockRejectedValue(new Error('Erro delete'));

            const res = await request(app).delete('/candidaturaVoluntariado/candidaturas/9');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao remover candidatura' });
        });
    });
});