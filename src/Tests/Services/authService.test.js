const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const authService = require('../../Services/authService');

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        utilizador: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        administrador: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Mock do bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

// Mock do jwt
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('registerUtilizador deve registrar um novo utilizador', async () => {
        const mockData = {
            username: 'testuser',
            nome: 'Test User',
            email: 'testuser@example.com',
            telefone: '123456789',
            password: 'password123',
            morada: 'Rua Teste',
        };

        const mockUtilizador = { ...mockData, id: 1, password_hash: 'hashed_password' };

        bcrypt.hash.mockResolvedValue('hashed_password');
        prisma.utilizador.findUnique.mockResolvedValue(null);
        prisma.utilizador.create.mockResolvedValue(mockUtilizador);

        const novoUtilizador = await authService.registerUtilizador(mockData);

        expect(novoUtilizador).toEqual(mockUtilizador);
        expect(prisma.utilizador.findUnique).toHaveBeenCalledWith({
            where: { email: mockData.email },
        });
        expect(bcrypt.hash).toHaveBeenCalledWith(mockData.password, 10);
        expect(prisma.utilizador.create).toHaveBeenCalledWith({
            data: {
                username: mockData.username,
                nome: mockData.nome,
                email: mockData.email,
                telefone: mockData.telefone,
                password_hash: 'hashed_password',
                morada: mockData.morada,
            },
        });
    });

    test('registerUtilizador deve lançar erro se o email já estiver registrado', async () => {
        const mockData = {
            email: 'testuser@example.com',
            password: 'password123',
        };

        prisma.utilizador.findUnique.mockResolvedValueOnce(mockData);

        await expect(authService.registerUtilizador(mockData)).rejects.toThrow('Email já registrado');
    });

    test('registerAdministrador deve registrar um novo administrador', async () => {
        const mockData = {
            username: 'adminuser',
            nome: 'Admin User',
            email: 'adminuser@example.com',
            password: 'adminpassword123',
        };

        const mockAdmin = { ...mockData, id: 1, password_hash: 'hashed_password' };

        bcrypt.hash.mockResolvedValue('hashed_password');
        prisma.administrador.findUnique.mockResolvedValue(null);
        prisma.administrador.create.mockResolvedValue(mockAdmin);

        const novoAdmin = await authService.registerAdministrador(mockData);

        expect(novoAdmin).toEqual(mockAdmin);
        expect(prisma.administrador.findUnique).toHaveBeenCalledWith({
            where: { email: mockData.email },
        });
        expect(bcrypt.hash).toHaveBeenCalledWith(mockData.password, 10);
        expect(prisma.administrador.create).toHaveBeenCalledWith({
            data: {
                username: mockData.username,
                nome: mockData.nome,
                email: mockData.email,
                password_hash: 'hashed_password',
            },
        });
    });

    test('registerAdministrador deve lançar erro se o email já estiver registrado', async () => {
        const mockData = {
            email: 'adminuser@example.com',
            password: 'adminpassword123',
        };

        prisma.administrador.findUnique.mockResolvedValueOnce(mockData);

        await expect(authService.registerAdministrador(mockData)).rejects.toThrow('Email já registrado');
    });

    test('loginUtilizador deve retornar um token de login', async () => {
        const mockData = {
            email: 'testuser@example.com',
            password: 'password123',
        };

        const mockUtilizador = {
            id: 1,
            email: mockData.email,
            password_hash: await bcrypt.hash(mockData.password, 10),
        };

        jwt.sign.mockReturnValue('mocked_jwt_token');
        prisma.utilizador.findUnique.mockResolvedValue(mockUtilizador);
        bcrypt.compare.mockResolvedValue(true);

        const token = await authService.loginUtilizador(mockData);

        expect(token).toBe('mocked_jwt_token');
        expect(prisma.utilizador.findUnique).toHaveBeenCalledWith({
            where: { email: mockData.email },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(mockData.password, mockUtilizador.password_hash);
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUtilizador.id, email: mockUtilizador.email, role: 'Utilizador' },
            expect.any(String),
            { expiresIn: '2h' }
        );
    });

    test('loginUtilizador deve lançar erro se a password for inválida', async () => {
        const mockData = {
            email: 'testuser@example.com',
            password: 'wrongpassword',
        };

        const mockUtilizador = {
            id: 1,
            email: mockData.email,
            password_hash: await bcrypt.hash('correctpassword', 10),
        };

        prisma.utilizador.findUnique.mockResolvedValue(mockUtilizador);
        bcrypt.compare.mockResolvedValue(false);

        await expect(authService.loginUtilizador(mockData)).rejects.toThrow('Password inválida');
    });

    test('loginUtilizador deve lançar erro se o utilizador não for encontrado', async () => {
        const mockData = {
            email: 'nonexistentuser@example.com',
            password: 'password123',
        };

        prisma.utilizador.findUnique.mockResolvedValue(null);

        await expect(authService.loginUtilizador(mockData)).rejects.toThrow('Utilizador não encontrado');
    });

    test('loginAdministrador deve retornar um token de login', async () => {
        const mockData = {
            email: 'adminuser@example.com',
            password: 'adminpassword123',
        };

        const mockAdmin = {
            id: 1,
            email: mockData.email,
            password_hash: await bcrypt.hash(mockData.password, 10),
            ativo: true,
        };

        jwt.sign.mockReturnValue('mocked_admin_jwt_token');
        prisma.administrador.findUnique.mockResolvedValue(mockAdmin);
        bcrypt.compare.mockResolvedValue(true);

        const token = await authService.loginAdministrador(mockData);

        expect(token).toBe('mocked_admin_jwt_token');
        expect(prisma.administrador.findUnique).toHaveBeenCalledWith({
            where: { email: mockData.email },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(mockData.password, mockAdmin.password_hash);
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockAdmin.id, email: mockAdmin.email, role: 'Administrador' },
            expect.any(String),
            { expiresIn: '1h' }
        );
    });

    test('loginAdministrador deve lançar erro se o administrador não estiver ativo', async () => {
        const mockData = {
            email: 'adminuser@example.com',
            password: 'adminpassword123',
        };

        const mockAdmin = {
            id: 1,
            email: mockData.email,
            password_hash: await bcrypt.hash(mockData.password, 10),
            ativo: false,
        };

        prisma.administrador.findUnique.mockResolvedValue(mockAdmin);

        await expect(authService.loginAdministrador(mockData)).rejects.toThrow('Conta de administrador desativada');
    });

    test('loginAdministrador deve lançar erro se a password for inválida', async () => {
        const mockData = {
            email: 'adminuser@example.com',
            password: 'wrongpassword',
        };

        const mockAdmin = {
            id: 1,
            email: mockData.email,
            password_hash: await bcrypt.hash('correctpassword', 10),
            ativo: true,
        };

        prisma.administrador.findUnique.mockResolvedValue(mockAdmin);
        bcrypt.compare.mockResolvedValue(false);

        await expect(authService.loginAdministrador(mockData)).rejects.toThrow('Password inválida');
    });

    test('loginAdministrador deve lançar erro se o administrador não for encontrado', async () => {
        const mockData = {
            email: 'nonexistentadmin@example.com',
            password: 'adminpassword123',
        };

        prisma.administrador.findUnique.mockResolvedValue(null);

        await expect(authService.loginAdministrador(mockData)).rejects.toThrow('Administrador não encontrado');
    });
});