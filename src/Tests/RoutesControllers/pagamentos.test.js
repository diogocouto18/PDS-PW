// Mocks dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock para autenticação
    apenasUtilizadores: (req, res, next) => next(), // Mock para garantir que apenas utilizadores podem acessar
}));

// Mock do service de pagamento
jest.mock('../../Services/pagamentoService', () => ({
    comprarRifas: jest.fn(), // Mock para a função de compra de rifas
}));
const pagamentoService = require('../../Services/pagamentoService');

const request = require('supertest'); // Biblioteca para testar endpoints HTTP
const express = require('express'); // Framework para criar a aplicação
const pagamentosRouter = require('../../Routes/pagamentos'); // Router de pagamentos

// Monta app Express isolada apenas com o router de pagamentos
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
app.use('/pagamentos', pagamentosRouter); // Adiciona o router de pagamentos

// Suite de testes para as rotas /pagamentos
describe('Rotas /pagamentos (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota POST /pagamentos
    describe('POST /pagamentos', () => {
        it('devolve 201 e cria pagamento', async () => {
            // Mock de um pagamento bem-sucedido
            const mockPagamento = {
                id: 1,
                id_utilizador: 5,
                id_sorteio: 10,
                quantidadeCompra: 3,
                metodo_pagamento: 'MBWAY',
                valor_total: '15.00',
            };
            pagamentoService.comprarRifas.mockResolvedValue(mockPagamento);

            // Payload enviado na requisição
            const payload = {
                id_utilizador: '5',
                id_sorteio: '10',
                quantidadeCompra: '3',
                metodo_pagamento: 'MBWAY',
            };

            // Faz a requisição POST
            const res = await request(app)
                .post('/pagamentos')
                .send(payload);

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockPagamento);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(pagamentoService.comprarRifas).toHaveBeenCalledWith(5, 10, 3, 'MBWAY');
        });

        it('devolve 400 em caso de erro', async () => {
            // Mock para simular um erro na compra
            pagamentoService.comprarRifas.mockRejectedValue(new Error('Falha compra'));

            // Faz a requisição POST com dados inválidos
            const res = await request(app)
                .post('/pagamentos')
                .send({
                    id_utilizador: '1',
                    id_sorteio: '2',
                    quantidadeCompra: '1',
                    metodo_pagamento: 'Entidade_Referencia',
                });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Falha compra' });
        });
    });
});