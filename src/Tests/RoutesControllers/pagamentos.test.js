/**
 * src/Tests/Routes/pagamentos.test.js
 *
 * Testes de rota/controllers para Pagamentos (sem BD real),
 * mockando pagamentoService e ignorando autenticação.
 */

// Mocks dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasUtilizadores: (req, res, next) => next(),
}));

// Mock do service de pagamento
jest.mock('../../Services/pagamentoService', () => ({
    comprarRifas: jest.fn(),
}));
const pagamentoService = require('../../Services/pagamentoService');

const request = require('supertest');
const express = require('express');
const pagamentosRouter = require('../../Routes/pagamentos');

// Monta app Express isolada apenas com o router de pagamentos
const app = express();
app.use(express.json());
app.use('/pagamentos', pagamentosRouter);

describe('Rotas /pagamentos (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /pagamentos', () => {
        it('devolve 201 e cria pagamento', async () => {
            const mockPagamento = {
                id: 1,
                id_utilizador: 5,
                id_sorteio: 10,
                quantidadeCompra: 3,
                metodo_pagamento: 'MBWAY',
                valor_total: '15.00'
            };
            pagamentoService.comprarRifas.mockResolvedValue(mockPagamento);

            const payload = {
                id_utilizador: '5',
                id_sorteio: '10',
                quantidadeCompra: '3',
                metodo_pagamento: 'MBWAY'
            };

            const res = await request(app)
                .post('/pagamentos')
                .send(payload);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockPagamento);
            expect(pagamentoService.comprarRifas)
                .toHaveBeenCalledWith(5, 10, 3, 'MBWAY');
        });

        it('devolve 400 em caso de erro', async () => {
            pagamentoService.comprarRifas.mockRejectedValue(new Error('Falha compra'));

            const res = await request(app)
                .post('/pagamentos')
                .send({ id_utilizador: '1', id_sorteio: '2', quantidadeCompra: '1', metodo_pagamento: 'Entidade_Referencia' });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Falha compra' });
        });
    });
});
