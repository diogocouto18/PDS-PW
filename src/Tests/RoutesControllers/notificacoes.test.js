/**
 * src/Tests/RoutesControllers/notificacoes.test.js
 *
 * Testes de rota/controllers para Notificações (sem BD real),
 * mockando notificacaoService e ignorando autenticação.
 */

// Mock dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasProprioUtilizador: (req, res, next) => next(),
    apenasAdministrador: (req, res, next) => next(),
    proprioUtilizadorOuAdministrador: (req, res, next) => next(),
}));

// Mock do service de notificações
jest.mock('../../Services/notificacaoService', () => ({
    criarNotificacao: jest.fn(),
    listarNotificacoesPorUtilizador: jest.fn(),
    listarNotificacoesPorAdministrador: jest.fn(),
    abrirNotificacao: jest.fn(),
    apagarNotificacao: jest.fn(),
}));
const notificacaoService = require('../../Services/notificacaoService');

const request = require('supertest');
const express = require('express');
const notificacoesRouter = require('../../Routes/notificacoes');

// Monta app Express isolada apenas com o router de notificações
const app = express();
app.use(express.json());
app.use('/notificacoes', notificacoesRouter);

describe('Rotas /notificacoes (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /notificacoes', () => {
        it('devolve 201 e notificação criada', async () => {
            const mockNot = { id: 1, mensagem: 'Olá', id_utilizador: 3, id_administrador: 5 };
            notificacaoService.criarNotificacao.mockResolvedValue(mockNot);

            const res = await request(app)
                .post('/notificacoes')
                .send({ mensagem: 'Olá', id_utilizador: 3, id_administrador: 5 });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockNot);
            expect(notificacaoService.criarNotificacao)
                .toHaveBeenCalledWith({ mensagem: 'Olá', id_utilizador: 3, id_administrador: 5 });
        });

        it('devolve 500 em caso de erro', async () => {
            notificacaoService.criarNotificacao.mockRejectedValue(new Error('Erro criar'));

            const res = await request(app)
                .post('/notificacoes')
                .send({});

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro criar' });
        });
    });

    describe('GET /notificacoes/utilizador/:id_utilizador', () => {
        it('devolve 200 e lista de notificações', async () => {
            const mockList = [{ id: 2, id_utilizador: 4 }];
            notificacaoService.listarNotificacoesPorUtilizador.mockResolvedValue(mockList);

            const res = await request(app).get('/notificacoes/utilizador/4');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);
            expect(notificacaoService.listarNotificacoesPorUtilizador).toHaveBeenCalledWith('4');
        });

        it('devolve 500 em caso de erro', async () => {
            notificacaoService.listarNotificacoesPorUtilizador.mockRejectedValue(new Error('Erro list user'));

            const res = await request(app).get('/notificacoes/utilizador/4');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro list user' });
        });
    });

    describe('GET /notificacoes/administrador/:id_administrador', () => {
        it('devolve 200 e lista de notificações', async () => {
            const mockList = [{ id: 3, id_administrador: 5 }];
            notificacaoService.listarNotificacoesPorAdministrador.mockResolvedValue(mockList);

            const res = await request(app).get('/notificacoes/administrador/5');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);
            expect(notificacaoService.listarNotificacoesPorAdministrador).toHaveBeenCalledWith('5');
        });

        it('devolve 500 em caso de erro', async () => {
            notificacaoService.listarNotificacoesPorAdministrador.mockRejectedValue(new Error('Erro list admin'));

            const res = await request(app).get('/notificacoes/administrador/5');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro list admin' });
        });
    });

    describe('PUT /notificacoes/:id/abrir', () => {
        it('devolve 200 e abre notificação', async () => {
            const mockOpen = { id: 6, estado: 'Aberto' };
            notificacaoService.abrirNotificacao.mockResolvedValue(mockOpen);

            const res = await request(app).put('/notificacoes/6/abrir');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockOpen);
            expect(notificacaoService.abrirNotificacao).toHaveBeenCalledWith('6');
        });

        it('devolve 500 em caso de erro', async () => {
            notificacaoService.abrirNotificacao.mockRejectedValue(new Error('Erro open'));

            const res = await request(app).put('/notificacoes/7/abrir');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro open' });
        });
    });

    describe('DELETE /notificacoes/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            notificacaoService.apagarNotificacao.mockResolvedValue();

            const res = await request(app).delete('/notificacoes/9');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Notificação apagada com sucesso' });
            expect(notificacaoService.apagarNotificacao).toHaveBeenCalledWith('9');
        });

        it('devolve 500 em caso de erro', async () => {
            notificacaoService.apagarNotificacao.mockRejectedValue(new Error('Erro apagar'));

            const res = await request(app).delete('/notificacoes/9');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro apagar' });
        });
    });
});
