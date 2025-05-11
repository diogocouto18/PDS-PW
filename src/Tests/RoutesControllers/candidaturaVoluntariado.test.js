// Mock dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock para autenticação
    apenasUtilizadores: (req, res, next) => next(), // Mock para garantir que apenas utilizadores podem acessar
    apenasAdministrador: (req, res, next) => next(), // Mock para garantir que apenas administradores podem acessar
    apenasProprioUtilizador: (req, res, next) => next(), // Mock para garantir que apenas o próprio utilizador pode acessar
    proprioUtilizadorOuAdministrador: (req, res, next) => next(), // Mock para permitir acesso ao próprio utilizador ou administradores
}));

// Mock do service de candidatura de voluntariado
jest.mock('../../Services/candidaturaVoluntariadoService', () => ({
    criarCandidatura: jest.fn(), // Mock para criar candidatura
    avaliarCandidatura: jest.fn(), // Mock para avaliar candidatura
    listarPorAnuncio: jest.fn(), // Mock para listar candidaturas por anúncio
    listarMinhasCandidaturas: jest.fn(), // Mock para listar candidaturas do utilizador
    removerCandidatura: jest.fn(), // Mock para remover candidatura
}));
const candidaturaService = require('../../Services/candidaturaVoluntariadoService');

const request = require('supertest'); // Biblioteca para testar endpoints HTTP
const express = require('express'); // Framework para criar a aplicação
const candidaturaRouter = require('../../Routes/candidaturaVoluntariado'); // Router de candidaturas de voluntariado

// Monta app Express isolada apenas com o router de candidatura
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
// Injeta req.utilizador.id para endpoints que necessitam de user
app.use((req, res, next) => {
    req.utilizador = { id: 42 }; // Simula um utilizador autenticado com ID 42
    next();
});
app.use('/candidaturaVoluntariado', candidaturaRouter); // Adiciona o router de candidaturas de voluntariado

// Suite de testes para as rotas /candidaturaVoluntariado
describe('Rotas /candidaturaVoluntariado (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota POST /candidaturaVoluntariado
    describe('POST /candidaturaVoluntariado', () => {
        it('devolve 201 e cria candidatura', async () => {
            const mockCand = { id: 1, id_utilizador: 42, id_anuncio: 5, mensagem: 'Olá' };
            candidaturaService.criarCandidatura.mockResolvedValue(mockCand);

            const res = await request(app)
                .post('/candidaturaVoluntariado')
                .send({ id_anuncio: 5, mensagem: 'Olá' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockCand);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(candidaturaService.criarCandidatura).toHaveBeenCalledWith({
                id_utilizador: 42,
                id_anuncio: 5,
                mensagem: 'Olá',
            });
        });

        it('devolve 500 em caso de erro', async () => {
            candidaturaService.criarCandidatura.mockRejectedValue(new Error('Erro criar'));

            const res = await request(app)
                .post('/candidaturaVoluntariado')
                .send({ id_anuncio: 1 });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro criar' });
        });
    });

    // Testes para a rota PUT /candidaturaVoluntariado/:id/avaliar
    describe('PUT /candidaturaVoluntariado/:id/avaliar', () => {
        it('devolve 200 e avalia candidatura', async () => {
            const mockAval = { id: 2, estado: 'Aceite', id_administrador: 42 };
            candidaturaService.avaliarCandidatura.mockResolvedValue(mockAval);

            const res = await request(app)
                .put('/candidaturaVoluntariado/2/avaliar')
                .send({ estado: 'Aceite' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockAval);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(candidaturaService.avaliarCandidatura).toHaveBeenCalledWith('2', 'Aceite', 42);
        });

        it('devolve 500 em caso de erro', async () => {
            candidaturaService.avaliarCandidatura.mockRejectedValue(new Error('Erro avaliar'));

            const res = await request(app)
                .put('/candidaturaVoluntariado/3/avaliar')
                .send({ estado: 'Rejeitado' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro avaliar' });
        });
    });

    // Testes para a rota GET /candidaturaVoluntariado/anuncio/:id_anuncio
    describe('GET /candidaturaVoluntariado/anuncio/:id_anuncio', () => {
        it('devolve 200 e lista de candidaturas', async () => {
            const mockList = [{ id: 1, id_anuncio: 7 }];
            candidaturaService.listarPorAnuncio.mockResolvedValue(mockList);

            const res = await request(app).get('/candidaturaVoluntariado/anuncio/7');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);

            // Verifica se o serviço foi chamado com o ID correto
            expect(candidaturaService.listarPorAnuncio).toHaveBeenCalledWith('7');
        });

        it('devolve 500 em caso de erro', async () => {
            candidaturaService.listarPorAnuncio.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/candidaturaVoluntariado/anuncio/8');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar candidaturas' });
        });
    });

    // Testes para a rota GET /candidaturaVoluntariado/minhas
    describe('GET /candidaturaVoluntariado/minhas', () => {
        it('devolve 200 e lista de candidaturas do utilizador', async () => {
            const mockMinhas = [{ id: 3, id_utilizador: 42 }];
            candidaturaService.listarMinhasCandidaturas.mockResolvedValue(mockMinhas);

            const res = await request(app).get('/candidaturaVoluntariado/minhas');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMinhas);

            // Verifica se o serviço foi chamado com o ID do utilizador correto
            expect(candidaturaService.listarMinhasCandidaturas).toHaveBeenCalledWith(42);
        });

        it('devolve 500 em caso de erro', async () => {
            candidaturaService.listarMinhasCandidaturas.mockRejectedValue(new Error('Erro min'));

            const res = await request(app).get('/candidaturaVoluntariado/minhas');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro interno ao buscar candidaturas' });
        });
    });

    // Testes para a rota DELETE /candidaturaVoluntariado/candidaturas/:id
    describe('DELETE /candidaturaVoluntariado/candidaturas/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            candidaturaService.removerCandidatura.mockResolvedValue();

            const res = await request(app).delete('/candidaturaVoluntariado/candidaturas/9');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Candidatura removida com sucesso' });

            // Verifica se o serviço foi chamado com o ID correto
            expect(candidaturaService.removerCandidatura).toHaveBeenCalledWith('9');
        });

        it('devolve 500 em caso de erro', async () => {
            candidaturaService.removerCandidatura.mockRejectedValue(new Error('Erro delete'));

            const res = await request(app).delete('/candidaturaVoluntariado/candidaturas/9');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao remover candidatura' });
        });
    });
});