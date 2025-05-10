/**
 * src/Tests/RoutesControllers/eventos.test.js
 *
 * Testes de rota/controllers para Eventos (sem BD real),
 * mockando eventoService e ignorando autenticação.
 */

// Mocks dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasAdministrador: (req, res, next) => next()
}));

// Mock do service de eventos
jest.mock('../../Services/eventoService');

const request = require('supertest');
const express = require('express');
const eventoService = require('../../Services/eventoService');
const eventosRouter = require('../../Routes/eventos');

// Monta app Express isolada apenas com o router de eventos
const app = express();
app.use(express.json());
// Simula req.utilizador.id no controller para todos os testes de POST /eventos
app.use((req, res, next) => { req.utilizador = { id: 5 }; next(); });
app.use('/eventos', eventosRouter);

describe('Rotas /eventos (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /eventos', () => {
        it('devolve 201 e o novo evento', async () => {
            const mockEvento = { id: 1, titulo: 'Festa', id_administrador: 5 };
            eventoService.criarEvento.mockResolvedValue(mockEvento);
            // Simula req.utilizador.id no controller
            app.use((req, res, next) => { req.utilizador = { id: 5 }; next(); });

            const res = await request(app)
                .post('/eventos')
                .send({ titulo: 'Festa', data_evento: '2025-06-01' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockEvento);
            expect(eventoService.criarEvento).toHaveBeenCalledWith({
                titulo: 'Festa',
                data_evento: '2025-06-01',
                id_administrador: 5
            });
        });

        it('devolve 500 em caso de erro', async () => {
            eventoService.criarEvento.mockRejectedValue(new Error('Falha criação'));
            app.use((req, res, next) => { req.utilizador = { id: 5 }; next(); });

            const res = await request(app)
                .post('/eventos')
                .send({ titulo: 'X' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao criar evento' });
        });
    });

    describe('GET /eventos', () => {
        it('devolve 200 e lista de eventos', async () => {
            const mockLista = [ { id: 1, titulo: 'E1' }, { id: 2, titulo: 'E2' } ];
            eventoService.listarEventos.mockResolvedValue(mockLista);

            const res = await request(app).get('/eventos');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLista);
            expect(eventoService.listarEventos).toHaveBeenCalled();
        });

        it('devolve 500 em caso de erro', async () => {
            eventoService.listarEventos.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/eventos');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar eventos' });
        });
    });

    describe('GET /eventos/:id', () => {
        it('devolve 200 e evento existente', async () => {
            const mockEvento = { id: 3, titulo: 'E3' };
            eventoService.obterEventoPorId.mockResolvedValue(mockEvento);

            const res = await request(app).get('/eventos/3');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockEvento);
            expect(eventoService.obterEventoPorId).toHaveBeenCalledWith('3');
        });

        it('devolve 404 se não existir', async () => {
            eventoService.obterEventoPorId.mockResolvedValue(null);

            const res = await request(app).get('/eventos/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Evento não encontrado' });
        });

        it('devolve 500 em caso de erro', async () => {
            eventoService.obterEventoPorId.mockRejectedValue(new Error('Erro buscar'));

            const res = await request(app).get('/eventos/3');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar evento' });
        });
    });

    describe('PUT /eventos/:id', () => {
        it('devolve 200 e evento atualizado', async () => {
            const update = { titulo: 'Novo' };
            const mockUpdated = { id: 4, titulo: 'Novo' };
            eventoService.atualizarEvento.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/eventos/4')
                .send(update);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);
            expect(eventoService.atualizarEvento).toHaveBeenCalledWith('4', update);
        });

        it('devolve 500 em caso de erro', async () => {
            eventoService.atualizarEvento.mockRejectedValue(new Error('Erro update'));

            const res = await request(app)
                .put('/eventos/4')
                .send({ titulo: 'X' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao atualizar evento' });
        });
    });

    describe('DELETE /eventos/eventos/:id', () => {
        it('devolve 200 em sucesso', async () => {
            eventoService.eliminarEvento.mockResolvedValue();

            const res = await request(app).delete('/eventos/eventos/5');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Evento eliminado com sucesso' });
            expect(eventoService.eliminarEvento).toHaveBeenCalledWith('5');
        });

        it('devolve 500 em caso de erro', async () => {
            eventoService.eliminarEvento.mockRejectedValue(new Error('Erro delete'));

            const res = await request(app).delete('/eventos/eventos/5');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao eliminar evento' });
        });
    });
});
