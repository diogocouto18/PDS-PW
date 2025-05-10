/**
 * src/Tests/RoutesControllers/rifas.test.js
 *
 * Testes de rota/controllers para Rifas (sem BD real),
 * mockando rifaService e ignorando autenticação.
 */

// Mock dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasAdministrador: (req, res, next) => next(),
    // para /minhas, apenas autenticação
}));

// Mock do service de rifas
jest.mock('../../Services/rifaService', () => ({
    listarRifasPorSorteio: jest.fn(),
    listarRifasUtilizador: jest.fn(),
    obterRifaPorId: jest.fn(),
    atualizarEstadoRifa: jest.fn(),
}));
const rifaService = require('../../Services/rifaService');

const request = require('supertest');
const express = require('express');
const rifasRouter = require('../../Routes/rifas');

// Monta app Express isolada apenas com o router de rifas
const app = express();
app.use(express.json());
// Injeta req.utilizador.id para /minhas
app.use((req, res, next) => { req.utilizador = { id: 99 }; next(); });
app.use('/rifas', rifasRouter);

describe('Rotas /rifas (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('GET /rifas/sorteio/:id_sorteio', () => {
        it('devolve 200 e lista de rifas', async () => {
            const mockList = [{ id:1, id_sorteio:3 }];
            rifaService.listarRifasPorSorteio.mockResolvedValue(mockList);

            const res = await request(app).get('/rifas/sorteio/3');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);
            expect(rifaService.listarRifasPorSorteio).toHaveBeenCalledWith('3');
        });

        it('devolve 500 em caso de erro', async () => {
            rifaService.listarRifasPorSorteio.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/rifas/sorteio/4');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro listar' });
        });
    });

    describe('GET /rifas/minhas', () => {
        it('devolve 200 e lista de rifas do utilizador', async () => {
            const mockMinhas = [{ id:2, id_utilizador:99 }];
            rifaService.listarRifasUtilizador.mockResolvedValue(mockMinhas);

            const res = await request(app).get('/rifas/minhas');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMinhas);
            expect(rifaService.listarRifasUtilizador).toHaveBeenCalledWith(99);
        });

        it('devolve 500 em caso de erro', async () => {
            rifaService.listarRifasUtilizador.mockRejectedValue(new Error('Erro min'));

            const res = await request(app).get('/rifas/minhas');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro min' });
        });
    });

    describe('GET /rifas/:id', () => {
        it('devolve 200 e rifa existente', async () => {
            const mockRifa = { id:5, estado: 'Comprada' };
            rifaService.obterRifaPorId.mockResolvedValue(mockRifa);

            const res = await request(app).get('/rifas/5');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockRifa);
            expect(rifaService.obterRifaPorId).toHaveBeenCalledWith('5');
        });

        it('devolve 404 se não existir', async () => {
            rifaService.obterRifaPorId.mockResolvedValue(null);

            const res = await request(app).get('/rifas/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Rifa não encontrada' });
        });

        it('devolve 500 em caso de erro', async () => {
            rifaService.obterRifaPorId.mockRejectedValue(new Error('Erro buscar'));

            const res = await request(app).get('/rifas/5');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro buscar' });
        });
    });

    describe('PUT /rifas/:id/estado', () => {
        it('devolve 200 e rifa atualizada', async () => {
            const mockUpdated = { id:6, estado: 'Vencedor' };
            rifaService.atualizarEstadoRifa.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/rifas/6/estado')
                .send({ estado: 'Vencedor' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);
            expect(rifaService.atualizarEstadoRifa).toHaveBeenCalledWith('6', 'Vencedor');
        });

        it('devolve 400 em caso de erro', async () => {
            rifaService.atualizarEstadoRifa.mockRejectedValue(new Error('Erro update'));

            const res = await request(app)
                .put('/rifas/7/estado')
                .send({ estado: 'X' });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erro update' });
        });
    });
});