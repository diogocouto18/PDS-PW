// Mocks para os serviços e middlewares
jest.mock('../../Services/authService'); // Mock do serviço de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock do middleware de autenticação
}));

// Importações necessárias
const authService = require('../../Services/authService');
const request = require('supertest'); // Biblioteca para testar endpoints HTTP
const express = require('express'); // Framework para criar a aplicação
const authRouter = require('../../Routes/auth'); // Router de autenticação

// Monta uma aplicação Express isolada apenas com o router /auth
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
app.use('/auth', authRouter); // Adiciona o router de autenticação

// Suite de testes para as rotas /auth
describe('Rotas /auth (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota POST /auth/register-utilizador
    describe('POST /auth/register-utilizador', () => {
        it('devolve 201 e retorna o novo utilizador', async () => {
            const mockUser = {
                id: 1,
                username: 'uTeste',
                nome: 'Usuario Teste',
                email: 'u@teste.com',
                telefone: '123',
                morada: 'Rua X',
            };
            authService.registerUtilizador.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/auth/register-utilizador')
                .send({
                    username: 'uTeste',
                    nome: 'Usuario Teste',
                    email: 'u@teste.com',
                    telefone: '123',
                    password: 'senha',
                    morada: 'Rua X',
                });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockUser);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(authService.registerUtilizador).toHaveBeenCalledWith({
                username: 'uTeste',
                nome: 'Usuario Teste',
                email: 'u@teste.com',
                telefone: '123',
                password: 'senha',
                morada: 'Rua X',
            });
        });

        it('devolve 400 em caso de erro', async () => {
            authService.registerUtilizador.mockRejectedValue(new Error('Email já registado'));

            const res = await request(app)
                .post('/auth/register-utilizador')
                .send({});

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Email já registado' });
        });
    });

    // Testes para a rota POST /auth/login-utilizador
    describe('POST /auth/login-utilizador', () => {
        it('devolve 200 e token', async () => {
            const mockLogin = { token: 'jwt', role: 'Utilizador', id: 1 };
            authService.loginUtilizador.mockResolvedValue(mockLogin);

            const res = await request(app)
                .post('/auth/login-utilizador')
                .send({ email: 'u@teste.com', password: 'senha' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLogin);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(authService.loginUtilizador).toHaveBeenCalledWith({
                email: 'u@teste.com',
                password: 'senha',
            });
        });

        it('devolve 401 em credenciais inválidas', async () => {
            authService.loginUtilizador.mockRejectedValue(new Error('Credenciais inválidas'));

            const res = await request(app)
                .post('/auth/login-utilizador')
                .send({ email: 'u@teste.com', password: 'errada' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: 'Credenciais inválidas' });
        });
    });

    // Testes para a rota POST /auth/register-administrador
    describe('POST /auth/register-administrador', () => {
        it('devolve 201 e retorna o novo admin', async () => {
            const mockAdmin = {
                id: 1,
                username: 'aTeste',
                nome: 'Admin Teste',
                email: 'a@teste.com',
            };
            authService.registerAdministrador.mockResolvedValue(mockAdmin);

            const res = await request(app)
                .post('/auth/register-administrador')
                .send({
                    username: 'aTeste',
                    nome: 'Admin Teste',
                    email: 'a@teste.com',
                    password: 'senha',
                    passphrase: 'phrase',
                });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockAdmin);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(authService.registerAdministrador).toHaveBeenCalledWith({
                username: 'aTeste',
                nome: 'Admin Teste',
                email: 'a@teste.com',
                password: 'senha',
                passphrase: 'phrase',
            });
        });

        it('devolve 400 em passphrase incorreta', async () => {
            authService.registerAdministrador.mockRejectedValue(new Error('Frase-passe incorreta'));

            const res = await request(app)
                .post('/auth/register-administrador')
                .send({});

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Frase-passe incorreta' });
        });
    });

    // Testes para a rota POST /auth/login-administrador
    describe('POST /auth/login-administrador', () => {
        it('devolve 200 e token', async () => {
            const mockLoginAdm = { token: 'jwtAdm', role: 'Administrador', id: 2 };
            authService.loginAdministrador.mockResolvedValue(mockLoginAdm);

            const res = await request(app)
                .post('/auth/login-administrador')
                .send({ email: 'a@teste.com', password: 'senha' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLoginAdm);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(authService.loginAdministrador).toHaveBeenCalledWith({
                email: 'a@teste.com',
                password: 'senha',
            });
        });

        it('devolve 401 em credenciais inválidas', async () => {
            authService.loginAdministrador.mockRejectedValue(new Error('Credenciais inválidas'));

            const res = await request(app)
                .post('/auth/login-administrador')
                .send({ email: 'a@teste.com', password: 'errada' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: 'Credenciais inválidas' });
        });
    });
});