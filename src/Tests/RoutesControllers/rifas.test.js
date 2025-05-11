// Mock dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock para autenticação
    apenasAdministrador: (req, res, next) => next(), // Mock para autorização de administradores
    // para /minhas, apenas autenticação
}));

// Mock do service de rifas
jest.mock('../../Services/rifaService', () => ({
    listarRifasPorSorteio: jest.fn(), // Mock para listar rifas por sorteio
    listarRifasUtilizador: jest.fn(), // Mock para listar rifas de um utilizador
    obterRifaPorId: jest.fn(), // Mock para obter uma rifa por ID
    atualizarEstadoRifa: jest.fn(), // Mock para atualizar o estado de uma rifa
}));
const rifaService = require('../../Services/rifaService');

const request = require('supertest'); // Biblioteca para testar endpoints HTTP
const express = require('express'); // Framework para criar a aplicação
const rifasRouter = require('../../Routes/rifas'); // Router de rifas

// Monta app Express isolada apenas com o router de rifas
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
// Injeta req.utilizador.id para /minhas
app.use((req, res, next) => {
    req.utilizador = { id: 99 }; // Simula um utilizador autenticado com ID 99
    next();
});
app.use('/rifas', rifasRouter); // Adiciona o router de rifas

// Suite de testes para as rotas /rifas
describe('Rotas /rifas (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota GET /rifas/sorteio/:id_sorteio
    describe('GET /rifas/sorteio/:id_sorteio', () => {
        it('devolve 200 e lista de rifas', async () => {
            const mockList = [{ id: 1, id_sorteio: 3 }];
            rifaService.listarRifasPorSorteio.mockResolvedValue(mockList);

            const res = await request(app).get('/rifas/sorteio/3');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);

            // Verifica se o serviço foi chamado com o ID correto
            expect(rifaService.listarRifasPorSorteio).toHaveBeenCalledWith('3');
        });

        it('devolve 500 em caso de erro', async () => {
            rifaService.listarRifasPorSorteio.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/rifas/sorteio/4');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro listar' });
        });
    });

    // Testes para a rota GET /rifas/minhas
    describe('GET /rifas/minhas', () => {
        it('devolve 200 e lista de rifas do utilizador', async () => {
            const mockMinhas = [{ id: 2, id_utilizador: 99 }];
            rifaService.listarRifasUtilizador.mockResolvedValue(mockMinhas);

            const res = await request(app).get('/rifas/minhas');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMinhas);

            // Verifica se o serviço foi chamado com o ID do utilizador correto
            expect(rifaService.listarRifasUtilizador).toHaveBeenCalledWith(99);
        });

        it('devolve 500 em caso de erro', async () => {
            rifaService.listarRifasUtilizador.mockRejectedValue(new Error('Erro min'));

            const res = await request(app).get('/rifas/minhas');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro min' });
        });
    });

    // Testes para a rota GET /rifas/:id
    describe('GET /rifas/:id', () => {
        it('devolve 200 e rifa existente', async () => {
            const mockRifa = { id: 5, estado: 'Comprada' };
            rifaService.obterRifaPorId.mockResolvedValue(mockRifa);

            const res = await request(app).get('/rifas/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockRifa);

            // Verifica se o serviço foi chamado com o ID correto
            expect(rifaService.obterRifaPorId).toHaveBeenCalledWith('5');
        });

        it('devolve 404 se não existir', async () => {
            rifaService.obterRifaPorId.mockResolvedValue(null);

            const res = await request(app).get('/rifas/999');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Rifa não encontrada' });
        });

        it('devolve 500 em caso de erro', async () => {
            rifaService.obterRifaPorId.mockRejectedValue(new Error('Erro buscar'));

            const res = await request(app).get('/rifas/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro buscar' });
        });
    });

    // Testes para a rota PUT /rifas/:id/estado
    describe('PUT /rifas/:id/estado', () => {
        it('devolve 200 e rifa atualizada', async () => {
            const mockUpdated = { id: 6, estado: 'Vencedor' };
            rifaService.atualizarEstadoRifa.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/rifas/6/estado')
                .send({ estado: 'Vencedor' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(rifaService.atualizarEstadoRifa).toHaveBeenCalledWith('6', 'Vencedor');
        });

        it('devolve 400 em caso de erro', async () => {
            rifaService.atualizarEstadoRifa.mockRejectedValue(new Error('Erro update'));

            const res = await request(app)
                .put('/rifas/7/estado')
                .send({ estado: 'X' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erro update' });
        });
    });
});