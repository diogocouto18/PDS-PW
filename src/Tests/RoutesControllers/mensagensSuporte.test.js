/**
 * Testes de rota/controllers para Mensagens de Suporte (sem BD real),
 * mocka mensagemSuporteService e ignora autenticação.
 *
 * Aborda:
 * - POST /mensagens-suporte
 * - POST /mensagens-suporte/:id_ticket/responder
 * - PUT /mensagens-suporte/:id_ticket/fechar
 * - GET /mensagens-suporte/:id_ticket
 * - DELETE /mensagens-suporte/suporte/:id_ticket
 */

jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Ignora autenticação
    apenasUtilizadores: (req, res, next) => next(), // Ignora restrição para utilizadores
    proprioUtilizadorOuAdministrador: (req, res, next) => next(), // Ignora restrição para utilizador ou admin
    apenasAdministrador: (req, res, next) => next(), // Ignora restrição para administradores
}));

jest.mock('../../Services/mensagemSuporteService', () => ({
    criarMensagemInicial: jest.fn(), // Mock para criar mensagem inicial
    enviarResposta: jest.fn(), // Mock para enviar resposta
    fecharTicket: jest.fn(), // Mock para fechar ticket
    listarMensagensDoTicket: jest.fn(), // Mock para listar mensagens de um ticket
    removerTicket: jest.fn(), // Mock para remover ticket
}));
const suporteService = require('../../Services/mensagemSuporteService');

const request = require('supertest');
const express = require('express');
const router = require('../../Routes/mensagensSuporte');

// Configuração da aplicação Express isolada
const app = express();
app.use(express.json());
// Injeta req.utilizador.id e tipo via header
app.use((req, res, next) => {
    const tipo = req.headers['x-user-type'];
    req.utilizador = { id: 10, tipo: tipo || 'Utilizador' }; // Simula um utilizador autenticado
    next();
});
app.use('/mensagens-suporte', router);

describe('Rotas /mensagens-suporte (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks()); // Limpa os mocks antes de cada teste

    // Testes para a rota POST /mensagens-suporte
    describe('POST /mensagens-suporte', () => {
        it('devolve 201 e cria mensagem inicial', async () => {
            const mockMsg = { id_ticket: '123', id_utilizador: 10, mensagem: 'Help' };
            suporteService.criarMensagemInicial.mockResolvedValue(mockMsg);

            const res = await request(app)
                .post('/mensagens-suporte')
                .send({ mensagem: 'Help' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockMsg);
            expect(suporteService.criarMensagemInicial).toHaveBeenCalledWith({
                id_ticket: expect.any(Number),
                id_utilizador: 10,
                mensagem: 'Help',
            });
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

    // Testes para a rota POST /mensagens-suporte/:id_ticket/responder
    describe('POST /mensagens-suporte/:id_ticket/responder', () => {
        it('devolve 200 e envia resposta de utilizador', async () => {
            const mockResp = { id_ticket: '123', mensagem: 'Reply', id_utilizador: 10, id_administrador: null };
            suporteService.enviarResposta.mockResolvedValue(mockResp);

            const res = await request(app)
                .post('/mensagens-suporte/123/responder')
                .send({ mensagem: 'Reply' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockResp);
            expect(suporteService.enviarResposta).toHaveBeenCalledWith({
                id_ticket: '123',
                mensagem: 'Reply',
                id_utilizador: 10,
                id_administrador: null,
            });
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
            expect(suporteService.enviarResposta).toHaveBeenCalledWith({
                id_ticket: '123',
                mensagem: 'Admin',
                id_utilizador: null,
                id_administrador: 10,
            });
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

    // Testes para a rota PUT /mensagens-suporte/:id_ticket/fechar
    describe('PUT /mensagens-suporte/:id_ticket/fechar', () => {
        it('devolve 200 e fecha ticket', async () => {
            const mockUpdates = [{ id: 1 }];
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

    // Testes para a rota GET /mensagens-suporte/:id_ticket
    describe('GET /mensagens-suporte/:id_ticket', () => {
        it('devolve 200 e lista de mensagens', async () => {
            const mockList = [{ id: 1, mensagem: 'X' }];
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

    // Testes para a rota DELETE /mensagens-suporte/suporte/:id_ticket
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