/**
 * src/Tests/RoutesControllers/auth.test.js
 *
 * Testes de rota/controllers para autenticação (sem BD real),
 * mockando authService e ignorando autenticação.
 */

// Mocks:
jest.mock('../../Services/authService');
jest.mock('../../Middlewares/authMiddlewares', () => ({ autenticacao: (req, res, next) => next() }));

const authService = require('../../Services/authService');
const request = require('supertest');
const express = require('express');
const authRouter = require('../../Routes/auth');

// Monta app Express isolada apenas com router /auth
const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Rotas /auth (sem BD)', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('POST /auth/register-utilizador', () => {
        it('devolve 201 e retorna o novo utilizador', async () => {
            const mockUser = { id: 1, username: 'uTeste', nome: 'Usuario Teste', email: 'u@teste.com', telefone: '123', morada: 'Rua X' };
            authService.registerUtilizador.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/auth/register-utilizador')
                .send({ username: 'uTeste', nome: 'Usuario Teste', email: 'u@teste.com', telefone: '123', password: 'senha', morada: 'Rua X' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockUser);
            expect(authService.registerUtilizador).toHaveBeenCalledWith({ username: 'uTeste', nome: 'Usuario Teste', email: 'u@teste.com', telefone: '123', password: 'senha', morada: 'Rua X' });
        });

        it('devolve 400 em caso de erro', async () => {
            authService.registerUtilizador.mockRejectedValue(new Error('Email já registado'));

            const res = await request(app)
                .post('/auth/register-utilizador')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Email já registado' });
        });
    });

    describe('POST /auth/login-utilizador', () => {
        it('devolve 200 e token', async () => {
            const mockLogin = { token: 'jwt', role: 'Utilizador', id: 1 };
            authService.loginUtilizador.mockResolvedValue(mockLogin);

            const res = await request(app)
                .post('/auth/login-utilizador')
                .send({ email: 'u@teste.com', password: 'senha' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLogin);
            expect(authService.loginUtilizador).toHaveBeenCalledWith({ email: 'u@teste.com', password: 'senha' });
        });

        it('devolve 401 em credenciais inválidas', async () => {
            authService.loginUtilizador.mockRejectedValue(new Error('Credenciais inválidas'));

            const res = await request(app)
                .post('/auth/login-utilizador')
                .send({ email: 'u@teste.com', password: 'errada' });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: 'Credenciais inválidas' });
        });
    });

    describe('POST /auth/register-administrador', () => {
        it('devolve 201 e retorna o novo admin', async () => {
            const mockAdmin = { id: 1, username: 'aTeste', nome: 'Admin Teste', email: 'a@teste.com' };
            authService.registerAdministrador.mockResolvedValue(mockAdmin);

            const res = await request(app)
                .post('/auth/register-administrador')
                .send({ username: 'aTeste', nome: 'Admin Teste', email: 'a@teste.com', password: 'senha', passphrase: 'phrase' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockAdmin);
            expect(authService.registerAdministrador).toHaveBeenCalledWith({ username: 'aTeste', nome: 'Admin Teste', email: 'a@teste.com', password: 'senha', passphrase: 'phrase' });
        });

        it('devolve 400 em passphrase incorreta', async () => {
            authService.registerAdministrador.mockRejectedValue(new Error('Frase-passe incorreta'));

            const res = await request(app)
                .post('/auth/register-administrador')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Frase-passe incorreta' });
        });
    });

    describe('POST /auth/login-administrador', () => {
        it('devolve 200 e token', async () => {
            const mockLoginAdm = { token: 'jwtAdm', role: 'Administrador', id: 2 };
            authService.loginAdministrador.mockResolvedValue(mockLoginAdm);

            const res = await request(app)
                .post('/auth/login-administrador')
                .send({ email: 'a@teste.com', password: 'senha' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLoginAdm);
            expect(authService.loginAdministrador).toHaveBeenCalledWith({ email: 'a@teste.com', password: 'senha' });
        });

        it('devolve 401 em credenciais inválidas', async () => {
            authService.loginAdministrador.mockRejectedValue(new Error('Credenciais inválidas'));

            const res = await request(app)
                .post('/auth/login-administrador')
                .send({ email: 'a@teste.com', password: 'errada' });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: 'Credenciais inválidas' });
        });
    });
});

