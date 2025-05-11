/**
 * src/Tests/RoutesControllers/auth.test.js
 *
 * Testes de "integração" ligeira para as rotas e controllers de autenticação,
 * usa mocks dos serviços para evitar chamadas ao BD.
 *
 * Aborda:
 * - POST /auth/register-utilizador
 * - POST /auth/login-utilizador
 * - POST /auth/register-administrador
 * - POST /auth/login-administrador
 *
 * Não requer BD real, testa apenas:
 *  routes → controllers → services mockados
 */

const request = require('supertest');
const app = require('../../../src/index'); // Importa o app Express
const authService = require('../../../src/Services/authService');

// Substitui todo o módulo authService por mocks automáticos
jest.mock('../../../src/Services/authService');

describe('Rotas /auth (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Testes para a rota POST /auth/register-utilizador
    describe('POST /auth/register-utilizador', () => {
        it('devolve 201 e o utilizador criado', async () => {
            const mockUser = {
                id: 1,
                username: 'uTeste',
                nome: 'Usuario Teste',
                email: 'u@teste.com',
                telefone: '123456789',
                morada: 'Rua X, 1',
            };
            authService.registerUtilizador.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/auth/register-utilizador')
                .send({
                    username: 'uTeste',
                    nome: 'Usuario Teste',
                    email: 'u@teste.com',
                    telefone: '123456789',
                    password: 'senha123',
                    morada: 'Rua X, 1',
                });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockUser);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(authService.registerUtilizador).toHaveBeenCalledWith({
                username: 'uTeste',
                nome: 'Usuario Teste',
                email: 'u@teste.com',
                telefone: '123456789',
                password: 'senha123',
                morada: 'Rua X, 1',
            });
        });

        it('devolve 400 em caso de erro de validação', async () => {
            authService.registerUtilizador.mockRejectedValue(new Error('Email já registado'));

            const res = await request(app)
                .post('/auth/register-utilizador')
                .send({}); // payload irrelevante

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Email já registado' });
        });
    });

    // Testes para a rota POST /auth/login-utilizador
    describe('POST /auth/login-utilizador', () => {
        it('devolve 200 e token JWT', async () => {
            const mockLogin = { token: 'jwt123', role: 'Utilizador', id: 42 };
            authService.loginUtilizador.mockResolvedValue(mockLogin);

            const res = await request(app)
                .post('/auth/login-utilizador')
                .send({ email: 'u@teste.com', password: 'senha123' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLogin);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(authService.loginUtilizador).toHaveBeenCalledWith({
                email: 'u@teste.com',
                password: 'senha123',
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
        it('devolve 201 e o admin criado', async () => {
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
                    password: 'senhaAdm',
                    passphrase: '8fG$7kL!p@2ZxQ#9r&Tm^uY',
                });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockAdmin);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(authService.registerAdministrador).toHaveBeenCalledWith({
                username: 'aTeste',
                nome: 'Admin Teste',
                email: 'a@teste.com',
                password: 'senhaAdm',
                passphrase: '8fG$7kL!p@2ZxQ#9r&Tm^uY',
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
        it('devolve 200 e token JWT', async () => {
            const mockLoginAdm = { token: 'jwtAdm', role: 'Administrador', id: 7 };
            authService.loginAdministrador.mockResolvedValue(mockLoginAdm);

            const res = await request(app)
                .post('/auth/login-administrador')
                .send({ email: 'a@teste.com', password: 'senhaAdm' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLoginAdm);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(authService.loginAdministrador).toHaveBeenCalledWith({
                email: 'a@teste.com',
                password: 'senhaAdm',
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