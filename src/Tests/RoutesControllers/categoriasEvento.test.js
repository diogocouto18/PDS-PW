/**
 * src/Tests/RoutesControllers/categoriasEvento.test.js
 *
 * Testes de rota/controllers para Categorias de Evento (sem BD real),
 * mockando categoriaEventoService e ignorando autenticação.
 */

// Mocks dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasAdministrador: (req, res, next) => next()
}));

// Mock do service de categorias de evento
jest.mock('../../Services/categoriaEventoService');
const categoriaService = require('../../Services/categoriaEventoService');

const request = require('supertest');
const express = require('express');
const categoriaRouter = require('../../Routes/categoriasEvento');

// Monta app Express isolada apenas com o router de categorias de evento
const app = express();
app.use(express.json());
app.use('/categoria-evento', categoriaRouter);

describe('Rotas /categoria-evento (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /categoria-evento', () => {
        it('devolve 201 e a nova categoria', async () => {
            const mockCategoria = { id: 1, nome: 'Cultura' };
            categoriaService.criar.mockResolvedValue(mockCategoria);

            const res = await request(app)
                .post('/categoria-evento')
                .send({ nome: 'Cultura' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockCategoria);
            expect(categoriaService.criar).toHaveBeenCalledWith({ nome: 'Cultura' });
        });

        it('devolve 500 em caso de erro', async () => {
            categoriaService.criar.mockRejectedValue(new Error('Falha criação'));

            const res = await request(app)
                .post('/categoria-evento')
                .send({ nome: 'X' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Falha criação' });
        });
    });

    describe('GET /categoria-evento', () => {
        it('devolve 200 e lista de categorias', async () => {
            const mockLista = [ { id: 1, nome: 'C1' }, { id: 2, nome: 'C2' } ];
            categoriaService.obterTodos.mockResolvedValue(mockLista);

            const res = await request(app).get('/categoria-evento');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLista);
            expect(categoriaService.obterTodos).toHaveBeenCalled();
        });

        it('devolve 500 em caso de erro', async () => {
            categoriaService.obterTodos.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/categoria-evento');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar categorias' });
        });
    });

    describe('GET /categoria-evento/:id', () => {
        it('devolve 200 e a categoria existente', async () => {
            const mockCat = { id: 3, nome: 'C3' };
            categoriaService.obterPorId.mockResolvedValue(mockCat);

            const res = await request(app).get('/categoria-evento/3');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockCat);
            expect(categoriaService.obterPorId).toHaveBeenCalledWith('3');
        });

        it('devolve 404 se não existir', async () => {
            categoriaService.obterPorId.mockResolvedValue(null);

            const res = await request(app).get('/categoria-evento/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Categoria não encontrada' });
        });

        it('devolve 500 em caso de erro', async () => {
            categoriaService.obterPorId.mockRejectedValue(new Error('Erro buscar'));

            const res = await request(app).get('/categoria-evento/3');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao encontrar categoria' });
        });
    });

    describe('PUT /categoria-evento/:id', () => {
        it('devolve 200 e categoria atualizada', async () => {
            const update = { nome: 'Atual' };
            const mockUpdated = { id: 4, nome: 'Atual' };
            categoriaService.atualizar.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/categoria-evento/4')
                .send(update);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);
            expect(categoriaService.atualizar).toHaveBeenCalledWith('4', update);
        });

        it('devolve 500 em caso de erro', async () => {
            categoriaService.atualizar.mockRejectedValue(new Error('Erro update'));

            const res = await request(app)
                .put('/categoria-evento/4')
                .send({ nome: 'X' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro update' });
        });
    });

    describe('DELETE /categoria-evento/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            categoriaService.eliminar.mockResolvedValue();

            const res = await request(app).delete('/categoria-evento/5');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Categoria apagada com sucesso' });
            expect(categoriaService.eliminar).toHaveBeenCalledWith('5');
        });

        it('devolve 500 em caso de erro', async () => {
            categoriaService.eliminar.mockRejectedValue(new Error('Erro apagar'));

            const res = await request(app).delete('/categoria-evento/5');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao apagar categoria' });
        });
    });
});
