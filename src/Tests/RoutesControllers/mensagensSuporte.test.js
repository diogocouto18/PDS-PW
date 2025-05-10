/**
 * src/Tests/RoutesControllers/mensagensSuporte.test.js
 *
 * Testes de rota/controllers para Mensagens de Suporte (sem BD real),
 * mockando mensagemSuporteService e ignorando autenticação.
 */

// Mocks dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasUtilizadores: (req, res, next) => next(),
    proprioUtilizadorOuAdministrador: (req, res, next) => next(),
    apenasAdministrador: (req, res, next) => next(),
}));

// Mock do service de mensagem de suporte
jest.mock('../../Services/mensagemSuporteService', () => ({
    criarMensagemInicial: jest.fn(),
    enviarResposta: jest.fn(),
    fecharTicket: jest.fn(),
    listarMensagensDoTicket: jest.fn(),
    removerTicket: jest.fn(),
}));
const suporteService = require('../../Services/mensagemSuporteService');

const request = require('supertest');
const express = require('express');
const router = require('../../Routes/mensagensSuporte');

// Monta app Express isolada apenas com o router de mensagensSuporte
const app = express();
app.use(express.json());
// Injeta req.utilizador.id e tipo via header
app.use((req, res, next) => {
    const tipo = req.headers['x-user-type'];
    req.utilizador = { id: 10, tipo: tipo || 'Utilizador' };
    next();
});
app.use('/mensagens-suporte', router);

describe('Rotas /mensagens-suporte (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /mensagens-suporte', () => {
        it('devolve 201 e cria mensagem inicial', async () => {
            const mockMsg = { id_ticket: '123', id_utilizador: 10, mensagem: 'Help' };
            suporteService.criarMensagemInicial.mockResolvedValue(mockMsg);

            const res = await request(app)
                .post('/mensagens-suporte')
                .send({ mensagem: 'Help' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockMsg);
            expect(suporteService.criarMensagemInicial)
                .toHaveBeenCalledWith({ id_ticket: expect.any(Number), id_utilizador: 10, mensagem: 'Help' });
        });

        it('devolve 500 em caso de erro', async () => {
            suporteService.criarMensagemInicial.mockRejectedValue(new Error('Erro criar'));

            const res = await request(app)
                .post('/mensagens-suporte')
                .send({ mensagem: 'X' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro criar' });
        });
    });

    describe('POST /mensagens-suporte/:id_ticket/responder', () => {
        it('devolve 200 e envia resposta de utilizador', async () => {
            const mockResp = { id_ticket: '123', mensagem: 'Reply', id_utilizador: 10, id_administrador: null };
            suporteService.enviarResposta.mockResolvedValue(mockResp);

            const res = await request(app)
                .post('/mensagens-suporte/123/responder')
                .send({ mensagem: 'Reply' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockResp);
            expect(suporteService.enviarResposta)
                .toHaveBeenCalledWith({ id_ticket: '123', mensagem: 'Reply', id_utilizador: 10, id_administrador: null });
        });

        it('devolve 200 e envia resposta de administrador', async () => {
            const mockAdmin = { id_ticket: '123', mensagem: 'Admin', id_utilizador: null, id_administrador: 10 };
            suporteService.enviarResposta.mockResolvedValue(mockAdmin);

            const res = await request(app)
                .post('/mensagens-suporte/123/responder')
                .set('x-user-type', 'Administrador')
                .send({ mensagem: 'Admin' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockAdmin);
            expect(suporteService.enviarResposta)
                .toHaveBeenCalledWith({ id_ticket: '123', mensagem: 'Admin', id_utilizador: null, id_administrador: 10 });
        });

        it('devolve 500 em caso de erro', async () => {
            suporteService.enviarResposta.mockRejectedValue(new Error('Erro resp'));

            const res = await request(app)
                .post('/mensagens-suporte/999/responder')
                .send({ mensagem: 'X' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro resp' });
        });
    });

    describe('PUT /mensagens-suporte/:id_ticket/fechar', () => {
        it('devolve 200 e fecha ticket', async () => {
            const mockUpdates = [{ id:1 }];
            suporteService.fecharTicket.mockResolvedValue(mockUpdates);

            const res = await request(app).put('/mensagens-suporte/123/fechar');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Ticket fechado com sucesso.', updates: mockUpdates });
            expect(suporteService.fecharTicket).toHaveBeenCalledWith('123');
        });

        it('devolve 500 em caso de erro', async () => {
            suporteService.fecharTicket.mockRejectedValue(new Error('Erro fechar'));

            const res = await request(app).put('/mensagens-suporte/123/fechar');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro fechar' });
        });
    });

    describe('GET /mensagens-suporte/:id_ticket', () => {
        it('devolve 200 e lista de mensagens', async () => {
            const mockList = [{ id:1, mensagem: 'X' }];
            suporteService.listarMensagensDoTicket.mockResolvedValue(mockList);

            const res = await request(app).get('/mensagens-suporte/123');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);
            expect(suporteService.listarMensagensDoTicket).toHaveBeenCalledWith('123');
        });

        it('devolve 500 em caso de erro', async () => {
            suporteService.listarMensagensDoTicket.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/mensagens-suporte/123');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro listar' });
        });
    });

    describe('DELETE /mensagens-suporte/suporte/:id_ticket', () => {
        it('devolve 200 em caso de sucesso', async () => {
            suporteService.removerTicket.mockResolvedValue();

            const res = await request(app).delete('/mensagens-suporte/suporte/123');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Ticket removido com sucesso' });
            expect(suporteService.removerTicket).toHaveBeenCalledWith('123');
        });

        it('devolve 500 em caso de erro', async () => {
            suporteService.removerTicket.mockRejectedValue(new Error('Erro delete'));

            const res = await request(app).delete('/mensagens-suporte/suporte/123');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao remover ticket' });
        });
    });
});
