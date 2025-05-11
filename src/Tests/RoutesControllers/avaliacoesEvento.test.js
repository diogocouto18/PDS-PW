// Mock dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock para autenticação
    apenasAdministrador: (req, res, next) => next(), // Mock para garantir que apenas administradores podem acessar
    apenasUtilizadores: (req, res, next) => next(), // Mock para garantir que apenas utilizadores podem acessar
    apenasProprioUtilizador: (req, res, next) => next(), // Mock para garantir que apenas o próprio utilizador pode acessar
}));

// Mock do service de avaliação de evento
jest.mock('../../Services/avaliacaoEventoService', () => ({
    criarAvaliacao: jest.fn(), // Mock para criar avaliação
    listarPorEvento: jest.fn(), // Mock para listar avaliações por evento
    obterPorId: jest.fn(), // Mock para obter avaliação por ID
    atualizarAvaliacao: jest.fn(), // Mock para atualizar avaliação
    eliminarAvaliacao: jest.fn(), // Mock para eliminar avaliação
    mediaDoEvento: jest.fn(), // Mock para calcular a média de avaliações de um evento
}));
const avaliacaoService = require('../../Services/avaliacaoEventoService');

const request = require('supertest'); // Biblioteca para testar endpoints HTTP
const express = require('express'); // Framework para criar a aplicação
const avaliacaoRouter = require('../../Routes/avaliacoesEvento'); // Router de avaliações de evento

// Monta app Express isolada apenas com o router de avaliações de evento
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
// Injeta req.utilizador para endpoints que necessitam de user
app.use((req, res, next) => { req.utilizador = { id: 10 }; next(); });
app.use('/avaliacao-evento', avaliacaoRouter); // Adiciona o router de avaliações de evento

// Suite de testes para as rotas /avaliacao-evento
describe('Rotas /avaliacao-evento (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota POST /avaliacao-evento
    describe('POST /avaliacao-evento', () => {
        it('devolve 201 e cria avaliação', async () => {
            const mockAval = { id: 1, id_utilizador: 10, id_evento: 2, nota: 5 };
            avaliacaoService.criarAvaliacao.mockResolvedValue(mockAval);

            const res = await request(app)
                .post('/avaliacao-evento')
                .send({ id_evento: 2, nota: 5 });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockAval);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(avaliacaoService.criarAvaliacao).toHaveBeenCalledWith({
                id_utilizador: 10,
                id_evento: 2,
                nota: 5,
            });
        });

        it('devolve 400 em caso de erro de validação', async () => {
            avaliacaoService.criarAvaliacao.mockRejectedValue(new Error('Nota inválida'));

            const res = await request(app)
                .post('/avaliacao-evento')
                .send({});

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Nota inválida' });
        });
    });

    // Testes para a rota GET /avaliacao-evento/evento/:id_evento
    describe('GET /avaliacao-evento/evento/:id_evento', () => {
        it('devolve 200 e lista de avaliações', async () => {
            const mockList = [{ id: 1, nota: 5 }, { id: 2, nota: 4 }];
            avaliacaoService.listarPorEvento.mockResolvedValue(mockList);

            const res = await request(app).get('/avaliacao-evento/evento/3');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);

            // Verifica se o serviço foi chamado com o ID correto
            expect(avaliacaoService.listarPorEvento).toHaveBeenCalledWith('3');
        });

        it('devolve 500 em caso de erro', async () => {
            avaliacaoService.listarPorEvento.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/avaliacao-evento/evento/3');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao listar avaliações' });
        });
    });

    // Testes para a rota PUT /avaliacao-evento/:id
    describe('PUT /avaliacao-evento/:id', () => {
        it('devolve 404 se não existir', async () => {
            avaliacaoService.obterPorId.mockResolvedValue(null);

            const res = await request(app)
                .put('/avaliacao-evento/5')
                .send({ nota: 3 });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Avaliação não encontrada' });
        });

        it('devolve 403 se for de outro utilizador', async () => {
            avaliacaoService.obterPorId.mockResolvedValue({ id_utilizador: 2 });

            const res = await request(app)
                .put('/avaliacao-evento/5')
                .send({ nota: 3 });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(403);
            expect(res.body).toEqual({ error: 'Só podes atualizar a tua própria avaliação' });
        });

        it('devolve 200 e avaliação atualizada', async () => {
            avaliacaoService.obterPorId.mockResolvedValue({ id_utilizador: 10 });
            const mockUpdated = { id: 5, nota: 3 };
            avaliacaoService.atualizarAvaliacao.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/avaliacao-evento/5')
                .send({ nota: 3 });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(avaliacaoService.atualizarAvaliacao).toHaveBeenCalledWith('5', { nota: 3 });
        });

        it('devolve 400 em caso de erro de atualização', async () => {
            avaliacaoService.obterPorId.mockResolvedValue({ id_utilizador: 10 });
            avaliacaoService.atualizarAvaliacao.mockRejectedValue(new Error('Erro update'));

            const res = await request(app)
                .put('/avaliacao-evento/5')
                .send({ nota: 3 });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erro update' });
        });
    });

    // Testes para a rota DELETE /avaliacao-evento/:id
    describe('DELETE /avaliacao-evento/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            avaliacaoService.eliminarAvaliacao.mockResolvedValue();

            const res = await request(app).delete('/avaliacao-evento/6');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Avaliação removida com sucesso' });

            // Verifica se o serviço foi chamado com o ID correto
            expect(avaliacaoService.eliminarAvaliacao).toHaveBeenCalledWith('6');
        });

        it('devolve 500 em caso de erro', async () => {
            avaliacaoService.eliminarAvaliacao.mockRejectedValue(new Error('Erro delete'));

            const res = await request(app).delete('/avaliacao-evento/6');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro delete' });
        });
    });

    // Testes para a rota GET /avaliacao-evento/evento/:id_evento/media
    describe('GET /avaliacao-evento/evento/:id_evento/media', () => {
        it('devolve 200 e média', async () => {
            avaliacaoService.mediaDoEvento.mockResolvedValue(4.2);

            const res = await request(app).get('/avaliacao-evento/evento/8/media');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ media: 4.2 });

            // Verifica se o serviço foi chamado com o ID correto
            expect(avaliacaoService.mediaDoEvento).toHaveBeenCalledWith('8');
        });

        it('devolve 500 em caso de erro', async () => {
            avaliacaoService.mediaDoEvento.mockRejectedValue(new Error('Erro media'));

            const res = await request(app).get('/avaliacao-evento/evento/8/media');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao calcular média' });
        });
    });
});