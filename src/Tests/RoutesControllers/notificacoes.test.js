// Mock dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock para autenticação
    apenasProprioUtilizador: (req, res, next) => next(), // Mock para garantir que apenas o próprio utilizador pode acessar
    apenasAdministrador: (req, res, next) => next(), // Mock para garantir que apenas administradores podem acessar
    proprioUtilizadorOuAdministrador: (req, res, next) => next(), // Mock para permitir acesso ao próprio utilizador ou administradores
}));

// Mock do service de notificações
jest.mock('../../Services/notificacaoService', () => ({
    criarNotificacao: jest.fn(), // Mock para criar notificações
    listarNotificacoesPorUtilizador: jest.fn(), // Mock para listar notificações de um utilizador
    listarNotificacoesPorAdministrador: jest.fn(), // Mock para listar notificações de um administrador
    abrirNotificacao: jest.fn(), // Mock para abrir uma notificação
    apagarNotificacao: jest.fn(), // Mock para apagar uma notificação
}));
const notificacaoService = require('../../Services/notificacaoService');

const request = require('supertest'); // Biblioteca para testar endpoints HTTP
const express = require('express'); // Framework para criar a aplicação
const notificacoesRouter = require('../../Routes/notificacoes'); // Router de notificações

// Monta app Express isolada apenas com o router de notificações
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
app.use('/notificacoes', notificacoesRouter); // Adiciona o router de notificações

// Suite de testes para as rotas /notificacoes
describe('Rotas /notificacoes (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota POST /notificacoes
    describe('POST /notificacoes', () => {
        it('devolve 201 e notificação criada', async () => {
            const mockNot = { id: 1, mensagem: 'Olá', id_utilizador: 3, id_administrador: 5 };
            notificacaoService.criarNotificacao.mockResolvedValue(mockNot);

            const res = await request(app)
                .post('/notificacoes')
                .send({ mensagem: 'Olá', id_utilizador: 3, id_administrador: 5 });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockNot);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(notificacaoService.criarNotificacao).toHaveBeenCalledWith({
                mensagem: 'Olá',
                id_utilizador: 3,
                id_administrador: 5,
            });
        });

        it('devolve 500 em caso de erro', async () => {
            notificacaoService.criarNotificacao.mockRejectedValue(new Error('Erro criar'));

            const res = await request(app)
                .post('/notificacoes')
                .send({});

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro criar' });
        });
    });

    // Testes para a rota GET /notificacoes/utilizador/:id_utilizador
    describe('GET /notificacoes/utilizador/:id_utilizador', () => {
        it('devolve 200 e lista de notificações', async () => {
            const mockList = [{ id: 2, id_utilizador: 4 }];
            notificacaoService.listarNotificacoesPorUtilizador.mockResolvedValue(mockList);

            const res = await request(app).get('/notificacoes/utilizador/4');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);

            // Verifica se o serviço foi chamado com o ID correto
            expect(notificacaoService.listarNotificacoesPorUtilizador).toHaveBeenCalledWith('4');
        });

        it('devolve 500 em caso de erro', async () => {
            notificacaoService.listarNotificacoesPorUtilizador.mockRejectedValue(new Error('Erro list user'));

            const res = await request(app).get('/notificacoes/utilizador/4');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro list user' });
        });
    });

    // Testes para a rota GET /notificacoes/administrador/:id_administrador
    describe('GET /notificacoes/administrador/:id_administrador', () => {
        it('devolve 200 e lista de notificações', async () => {
            const mockList = [{ id: 3, id_administrador: 5 }];
            notificacaoService.listarNotificacoesPorAdministrador.mockResolvedValue(mockList);

            const res = await request(app).get('/notificacoes/administrador/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);

            // Verifica se o serviço foi chamado com o ID correto
            expect(notificacaoService.listarNotificacoesPorAdministrador).toHaveBeenCalledWith('5');
        });

        it('devolve 500 em caso de erro', async () => {
            notificacaoService.listarNotificacoesPorAdministrador.mockRejectedValue(new Error('Erro list admin'));

            const res = await request(app).get('/notificacoes/administrador/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro list admin' });
        });
    });

    // Testes para a rota PUT /notificacoes/:id/abrir
    describe('PUT /notificacoes/:id/abrir', () => {
        it('devolve 200 e abre notificação', async () => {
            const mockOpen = { id: 6, estado: 'Aberto' };
            notificacaoService.abrirNotificacao.mockResolvedValue(mockOpen);

            const res = await request(app).put('/notificacoes/6/abrir');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockOpen);

            // Verifica se o serviço foi chamado com o ID correto
            expect(notificacaoService.abrirNotificacao).toHaveBeenCalledWith('6');
        });

        it('devolve 500 em caso de erro', async () => {
            notificacaoService.abrirNotificacao.mockRejectedValue(new Error('Erro open'));

            const res = await request(app).put('/notificacoes/7/abrir');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro open' });
        });
    });

    // Testes para a rota DELETE /notificacoes/:id
    describe('DELETE /notificacoes/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            notificacaoService.apagarNotificacao.mockResolvedValue();

            const res = await request(app).delete('/notificacoes/9');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Notificação apagada com sucesso' });

            // Verifica se o serviço foi chamado com o ID correto
            expect(notificacaoService.apagarNotificacao).toHaveBeenCalledWith('9');
        });

        it('devolve 500 em caso de erro', async () => {
            notificacaoService.apagarNotificacao.mockRejectedValue(new Error('Erro apagar'));

            const res = await request(app).delete('/notificacoes/9');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro apagar' });
        });
    });
});