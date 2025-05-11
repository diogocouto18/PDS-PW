// Mocks dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock para autenticação
    apenasAdministrador: (req, res, next) => next(), // Mock para garantir que apenas administradores podem acessar
}));

// Mock do service de categorias de evento
jest.mock('../../Services/categoriaEventoService');
const categoriaService = require('../../Services/categoriaEventoService');

const request = require('supertest'); // Biblioteca para testar endpoints HTTP
const express = require('express'); // Framework para criar a aplicação
const categoriaRouter = require('../../Routes/categoriasEvento'); // Router de categorias de evento

// Monta app Express isolada apenas com o router de categorias de evento
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
app.use('/categoria-evento', categoriaRouter); // Adiciona o router de categorias de evento

// Suite de testes para as rotas /categoria-evento
describe('Rotas /categoria-evento (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota POST /categoria-evento
    describe('POST /categoria-evento', () => {
        it('devolve 201 e a nova categoria', async () => {
            const mockCategoria = { id: 1, nome: 'Cultura' };
            categoriaService.criar.mockResolvedValue(mockCategoria);

            const res = await request(app)
                .post('/categoria-evento')
                .send({ nome: 'Cultura' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockCategoria);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(categoriaService.criar).toHaveBeenCalledWith({ nome: 'Cultura' });
        });

        it('devolve 500 em caso de erro', async () => {
            categoriaService.criar.mockRejectedValue(new Error('Falha criação'));

            const res = await request(app)
                .post('/categoria-evento')
                .send({ nome: 'X' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Falha criação' });
        });
    });

    // Testes para a rota GET /categoria-evento
    describe('GET /categoria-evento', () => {
        it('devolve 200 e lista de categorias', async () => {
            const mockLista = [{ id: 1, nome: 'C1' }, { id: 2, nome: 'C2' }];
            categoriaService.obterTodos.mockResolvedValue(mockLista);

            const res = await request(app).get('/categoria-evento');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLista);

            // Verifica se o serviço foi chamado
            expect(categoriaService.obterTodos).toHaveBeenCalled();
        });

        it('devolve 500 em caso de erro', async () => {
            categoriaService.obterTodos.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/categoria-evento');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar categorias' });
        });
    });

    // Testes para a rota GET /categoria-evento/:id
    describe('GET /categoria-evento/:id', () => {
        it('devolve 200 e a categoria existente', async () => {
            const mockCat = { id: 3, nome: 'C3' };
            categoriaService.obterPorId.mockResolvedValue(mockCat);

            const res = await request(app).get('/categoria-evento/3');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockCat);

            // Verifica se o serviço foi chamado com o ID correto
            expect(categoriaService.obterPorId).toHaveBeenCalledWith('3');
        });

        it('devolve 404 se não existir', async () => {
            categoriaService.obterPorId.mockResolvedValue(null);

            const res = await request(app).get('/categoria-evento/999');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Categoria não encontrada' });
        });

        it('devolve 500 em caso de erro', async () => {
            categoriaService.obterPorId.mockRejectedValue(new Error('Erro buscar'));

            const res = await request(app).get('/categoria-evento/3');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao encontrar categoria' });
        });
    });

    // Testes para a rota PUT /categoria-evento/:id
    describe('PUT /categoria-evento/:id', () => {
        it('devolve 200 e categoria atualizada', async () => {
            const update = { nome: 'Atual' };
            const mockUpdated = { id: 4, nome: 'Atual' };
            categoriaService.atualizar.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/categoria-evento/4')
                .send(update);

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(categoriaService.atualizar).toHaveBeenCalledWith('4', update);
        });

        it('devolve 500 em caso de erro', async () => {
            categoriaService.atualizar.mockRejectedValue(new Error('Erro update'));

            const res = await request(app)
                .put('/categoria-evento/4')
                .send({ nome: 'X' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro update' });
        });
    });

    // Testes para a rota DELETE /categoria-evento/:id
    describe('DELETE /categoria-evento/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            categoriaService.eliminar.mockResolvedValue();

            const res = await request(app).delete('/categoria-evento/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Categoria apagada com sucesso' });

            // Verifica se o serviço foi chamado com o ID correto
            expect(categoriaService.eliminar).toHaveBeenCalledWith('5');
        });

        it('devolve 500 em caso de erro', async () => {
            categoriaService.eliminar.mockRejectedValue(new Error('Erro apagar'));

            const res = await request(app).delete('/categoria-evento/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao apagar categoria' });
        });
    });
});