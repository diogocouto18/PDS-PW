// Mocks dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock para autenticação
    apenasAdministrador: (req, res, next) => next(), // Mock para garantir que apenas administradores podem acessar
}));

// Mock do service de eventos
jest.mock('../../Services/eventoService');

const request = require('supertest'); // Biblioteca para testar endpoints HTTP
const express = require('express'); // Framework para criar a aplicação
const eventoService = require('../../Services/eventoService');
const eventosRouter = require('../../Routes/eventos'); // Router de eventos

// Monta app Express isolada apenas com o router de eventos
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
// Simula req.utilizador.id no controller para todos os testes de POST /eventos
app.use((req, res, next) => {
    req.utilizador = { id: 5 }; // Simula um administrador autenticado com ID 5
    next();
});
app.use('/eventos', eventosRouter); // Adiciona o router de eventos

// Suite de testes para as rotas /eventos
describe('Rotas /eventos (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota POST /eventos
    describe('POST /eventos', () => {
        it('devolve 201 e o novo evento', async () => {
            const mockEvento = { id: 1, titulo: 'Festa', id_administrador: 5 };
            eventoService.criarEvento.mockResolvedValue(mockEvento);

            const res = await request(app)
                .post('/eventos')
                .send({ titulo: 'Festa', data_evento: '2025-06-01' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockEvento);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(eventoService.criarEvento).toHaveBeenCalledWith({
                titulo: 'Festa',
                data_evento: '2025-06-01',
                id_administrador: 5,
            });
        });

        it('devolve 500 em caso de erro', async () => {
            eventoService.criarEvento.mockRejectedValue(new Error('Falha criação'));

            const res = await request(app)
                .post('/eventos')
                .send({ titulo: 'X' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao criar evento' });
        });
    });

    // Testes para a rota GET /eventos
    describe('GET /eventos', () => {
        it('devolve 200 e lista de eventos', async () => {
            const mockLista = [{ id: 1, titulo: 'E1' }, { id: 2, titulo: 'E2' }];
            eventoService.listarEventos.mockResolvedValue(mockLista);

            const res = await request(app).get('/eventos');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLista);

            // Verifica se o serviço foi chamado
            expect(eventoService.listarEventos).toHaveBeenCalled();
        });

        it('devolve 500 em caso de erro', async () => {
            eventoService.listarEventos.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/eventos');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar eventos' });
        });
    });

    // Testes para a rota GET /eventos/:id
    describe('GET /eventos/:id', () => {
        it('devolve 200 e evento existente', async () => {
            const mockEvento = { id: 3, titulo: 'E3' };
            eventoService.obterEventoPorId.mockResolvedValue(mockEvento);

            const res = await request(app).get('/eventos/3');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockEvento);

            // Verifica se o serviço foi chamado com o ID correto
            expect(eventoService.obterEventoPorId).toHaveBeenCalledWith('3');
        });

        it('devolve 404 se não existir', async () => {
            eventoService.obterEventoPorId.mockResolvedValue(null);

            const res = await request(app).get('/eventos/999');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Evento não encontrado' });
        });

        it('devolve 500 em caso de erro', async () => {
            eventoService.obterEventoPorId.mockRejectedValue(new Error('Erro buscar'));

            const res = await request(app).get('/eventos/3');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar evento' });
        });
    });

    // Testes para a rota PUT /eventos/:id
    describe('PUT /eventos/:id', () => {
        it('devolve 200 e evento atualizado', async () => {
            const update = { titulo: 'Novo' };
            const mockUpdated = { id: 4, titulo: 'Novo' };
            eventoService.atualizarEvento.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/eventos/4')
                .send(update);

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(eventoService.atualizarEvento).toHaveBeenCalledWith('4', update);
        });

        it('devolve 500 em caso de erro', async () => {
            eventoService.atualizarEvento.mockRejectedValue(new Error('Erro update'));

            const res = await request(app)
                .put('/eventos/4')
                .send({ titulo: 'X' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao atualizar evento' });
        });
    });

    // Testes para a rota DELETE /eventos/eventos/:id
    describe('DELETE /eventos/eventos/:id', () => {
        it('devolve 200 em sucesso', async () => {
            eventoService.eliminarEvento.mockResolvedValue();

            const res = await request(app).delete('/eventos/eventos/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Evento eliminado com sucesso' });

            // Verifica se o serviço foi chamado com o ID correto
            expect(eventoService.eliminarEvento).toHaveBeenCalledWith('5');
        });

        it('devolve 500 em caso de erro', async () => {
            eventoService.eliminarEvento.mockRejectedValue(new Error('Erro delete'));

            const res = await request(app).delete('/eventos/eventos/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao eliminar evento' });
        });
    });
});