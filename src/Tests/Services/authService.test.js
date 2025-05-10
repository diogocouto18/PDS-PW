// authService.test.js
// Testes unitários para o serviço de autenticação (auth.test.js)
// Usamos Jest para validarmos as funções de registo e login de utilizadores e administradores.

require('dotenv').config();

// Mock do PrismaClient antes de importar o módulo a testar
jest.mock('@prisma/client', () => {
    const mPrismaClient = jest.fn();
    return { PrismaClient: mPrismaClient };
});

// Mock de bcryptjs e jsonwebtoken para controlo de hashing e criação de tokens
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

let registerUtilizador;
let registerAdministrador;
let loginUtilizador;
let loginAdministrador;
let prisma;

beforeEach(() => {
    // Reinicializa módulos e mocks entre testes
    jest.resetModules();
    jest.clearAllMocks();

    // Define stubs para os delegates: utilizador e administrador
    const mockUtilizador = { findUnique: jest.fn(), create: jest.fn() };
    const mockAdministrador = { findUnique: jest.fn(), create: jest.fn() };
    prisma = { utilizador: mockUtilizador, administrador: mockAdministrador };

    // Faz com que new PrismaClient() retorne os stubs acima
    const { PrismaClient } = require('@prisma/client');
    PrismaClient.mockImplementation(() => prisma);

    // Importa o authService só depois de configurar o mock do PrismaClient
    const authService = require('../../Services/authService');
    registerUtilizador = authService.registerUtilizador;
    registerAdministrador = authService.registerAdministrador;
    loginUtilizador = authService.loginUtilizador;
    loginAdministrador = authService.loginAdministrador;
});

describe('authService', () => {

    describe('registerUtilizador', () => {
        const dadosUtilizador = {
            username: 'utilizadorTeste',
            nome: 'Utilizador de Teste',
            email: 'teste@exemplo.com',
            telefone: '912345678',
            password: 'senha123',
            morada: 'Rua de Exemplo, 123'
        };

        test('lança erro se o username já existir', async () => {
            // username duplicado no utilizador
            prisma.utilizador.findUnique.mockResolvedValueOnce({});
            // username duplicado no administrador (inexistente)
            prisma.administrador.findUnique.mockResolvedValueOnce(null);

            await expect(registerUtilizador(dadosUtilizador))
                .rejects.toThrow('Nome de Utilizador já registado');
        });

        test('lança erro se o email já existir', async () => {
            // username livre
            prisma.utilizador.findUnique.mockResolvedValueOnce(null);
            prisma.administrador.findUnique.mockResolvedValueOnce(null);
            // email duplicado no utilizador
            prisma.utilizador.findUnique.mockResolvedValueOnce({});
            // email duplicado no administrador (inexistente)
            prisma.administrador.findUnique.mockResolvedValueOnce(null);

            await expect(registerUtilizador(dadosUtilizador))
                .rejects.toThrow('Email já registado');
        });

        test('lança erro se o telefone estiver vazio', async () => {
            const dadosSemTelefone = { ...dadosUtilizador, telefone: '   ' };
            // username livre
            prisma.utilizador.findUnique.mockResolvedValueOnce(null);
            prisma.administrador.findUnique.mockResolvedValueOnce(null);
            // email livre
            prisma.utilizador.findUnique.mockResolvedValueOnce(null);
            prisma.administrador.findUnique.mockResolvedValueOnce(null);

            await expect(registerUtilizador(dadosSemTelefone))
                .rejects.toThrow('O telefone não pode estar vazio');
        });

        test('lança erro se o telefone já existir', async () => {
            // username e email livres
            prisma.utilizador.findUnique.mockResolvedValueOnce(null);
            prisma.administrador.findUnique.mockResolvedValueOnce(null);
            prisma.utilizador.findUnique.mockResolvedValueOnce(null);
            prisma.administrador.findUnique.mockResolvedValueOnce(null);
            // telefone duplicado
            prisma.utilizador.findUnique.mockResolvedValueOnce({});

            await expect(registerUtilizador(dadosUtilizador))
                .rejects.toThrow('Telefone já registado');
        });

        test('regista utilizador com sucesso', async () => {
            // todas as verificações livres (nome, email, telefone)
            prisma.utilizador.findUnique.mockResolvedValue(null);
            prisma.administrador.findUnique.mockResolvedValue(null);

            // mock do bcrypt e criação efetiva do utilizador
            const bcrypt = require('bcryptjs');
            bcrypt.hash.mockResolvedValue('hashfalsa');
            prisma.utilizador.create.mockResolvedValue({ id: 1, password_hash: 'hashfalsa', ...dadosUtilizador });

            const resultado = await registerUtilizador(dadosUtilizador);

            expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
            expect(prisma.utilizador.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    username: 'utilizadorTeste',
                    nome: 'Utilizador de Teste',
                    email: 'teste@exemplo.com',
                    telefone: '912345678',
                    password_hash: 'hashfalsa',
                    morada: 'Rua de Exemplo, 123'
                })
            });
            expect(resultado).toEqual({ id: 1, password_hash: 'hashfalsa', ...dadosUtilizador });
        });
    });

    describe('registerAdministrador', () => {
        const passCorreta = process.env.ADMINISTRADOR_PASSPHRASE;
        const dadosAdmin = {
            username: 'adminTeste',
            nome: 'Administrador de Teste',
            email: 'admin@exemplo.com',
            password: 'senhaAdm',
            passphrase: passCorreta
        };

        test('lança erro se a passphrase estiver incorreta', async () => {
            await expect(registerAdministrador({ ...dadosAdmin, passphrase: 'errada' }))
                .rejects.toThrow('Frase-passe incorreta');
        });

        test('lança erro se o username já existir', async () => {
            // username duplicado
            prisma.administrador.findUnique.mockResolvedValueOnce({});
            prisma.utilizador.findUnique.mockResolvedValueOnce(null);

            await expect(registerAdministrador(dadosAdmin))
                .rejects.toThrow('Nome de Utilizador já registado');
        });

        test('lança erro se o email já existir', async () => {
            // username livre
            prisma.administrador.findUnique.mockResolvedValueOnce(null);
            prisma.utilizador.findUnique.mockResolvedValueOnce(null);
            // email duplicado no administrador
            prisma.administrador.findUnique.mockResolvedValueOnce({});
            // email utilizador inexistente
            prisma.utilizador.findUnique.mockResolvedValueOnce(null);

            await expect(registerAdministrador(dadosAdmin))
                .rejects.toThrow('Email já registado');
        });

        test('regista administrador com sucesso', async () => {
            // todas as verificações livres (username, email)
            prisma.administrador.findUnique.mockResolvedValue(null);
            prisma.utilizador.findUnique.mockResolvedValue(null);

            const bcrypt = require('bcryptjs');
            bcrypt.hash.mockResolvedValue('hashAdmFalsa');
            prisma.administrador.create.mockResolvedValue({ id: 2, password_hash: 'hashAdmFalsa', ...dadosAdmin });

            const resultado = await registerAdministrador(dadosAdmin);

            expect(bcrypt.hash).toHaveBeenCalledWith('senhaAdm', 10);
            expect(prisma.administrador.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    username: 'adminTeste',
                    nome: 'Administrador de Teste',
                    email: 'admin@exemplo.com',
                    password_hash: 'hashAdmFalsa'
                })
            });
            expect(resultado).toEqual({ id: 2, password_hash: 'hashAdmFalsa', ...dadosAdmin });
        });
    });

    describe('loginUtilizador', () => {
        const creds = { email: 'user@exa.com', password: 'passUser' };

        test('lança erro se o utilizador não existir', async () => {
            prisma.utilizador.findUnique.mockResolvedValue(null);
            await expect(loginUtilizador(creds))
                .rejects.toThrow('Credenciais inválidas');
        });

        test('lança erro se a password for inválida', async () => {
            prisma.utilizador.findUnique.mockResolvedValue({ id: 3, email: creds.email, password_hash: 'hash' });
            const bcrypt = require('bcryptjs'); bcrypt.compare.mockResolvedValue(false);

            await expect(loginUtilizador(creds))
                .rejects.toThrow('Credenciais inválidas');
        });

        test('devolve token em caso de sucesso', async () => {
            prisma.utilizador.findUnique.mockResolvedValue({ id: 3, email: creds.email, password_hash: 'hash' });
            const bcrypt = require('bcryptjs'); bcrypt.compare.mockResolvedValue(true);
            const jwt = require('jsonwebtoken'); jwt.sign.mockReturnValue('tokenUser');

            const resultado = await loginUtilizador(creds);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 3, email: creds.email, role: 'Utilizador' },
                process.env.JWT_SECRET || 'segredo_super_secreto',
                { expiresIn: '2h' }
            );
            expect(resultado).toEqual({ token: 'tokenUser', role: 'Utilizador', id: 3 });
        });
    });

    describe('loginAdministrador', () => {
        const credsAdm = { email: 'adm@exa.com', password: 'passAdm' };

        test('lança erro se o administrador não existir', async () => {
            prisma.administrador.findUnique.mockResolvedValue(null);
            await expect(loginAdministrador(credsAdm))
                .rejects.toThrow('Credenciais inválidas');
        });

        test('lança erro se a password for inválida', async () => {
            prisma.administrador.findUnique.mockResolvedValue({ id: 4, email: credsAdm.email, password_hash: 'hash', ativo: true });
            const bcrypt = require('bcryptjs'); bcrypt.compare.mockResolvedValue(false);

            await expect(loginAdministrador(credsAdm))
                .rejects.toThrow('Credenciais inválidas');
        });

        test('lança erro se a conta estiver desativada', async () => {
            prisma.administrador.findUnique.mockResolvedValue({ id: 4, email: credsAdm.email, password_hash: 'hash', ativo: false });
            const bcrypt = require('bcryptjs'); bcrypt.compare.mockResolvedValue(true);

            await expect(loginAdministrador(credsAdm))
                .rejects.toThrow('Conta de administrador desativada');
        });

        test('devolve token em caso de sucesso', async () => {
            prisma.administrador.findUnique.mockResolvedValue({ id: 4, email: credsAdm.email, password_hash: 'hash', ativo: true });
            const bcrypt = require('bcryptjs'); bcrypt.compare.mockResolvedValue(true);
            const jwt = require('jsonwebtoken'); jwt.sign.mockReturnValue('tokenAdm');

            const resultado = await loginAdministrador(credsAdm);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 4, email: credsAdm.email, role: 'Administrador' },
                process.env.JWT_SECRET || 'segredo_super_secreto',
                { expiresIn: '1h' }
            );
            expect(resultado).toEqual({ token: 'tokenAdm', role: 'Administrador', id: 4 });
        });
    });

});
