const { autenticacao, apenasUtilizadores, apenasAdministrador, apenasProprioUtilizador, proprioUtilizadorOuAdministrador } = require('../../Middlewares/authMiddlewares');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Mock do prisma
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            administrador: {
                findUnique: jest.fn().mockResolvedValue({ id: 1, ativo: true }),
            },
        })),
    };
});

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        // Resetando mocks
        req = {
            headers: {
                authorization: 'Bearer validToken',
            },
            params: {},  // Definir params explicitamente
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('deve passar no middleware de autenticação', async () => {
        const token = jwt.sign({ id: 1, email: 'test@domain.com', role: 'Utilizador' }, 'segredo_super_secreto', { expiresIn: '1h' });
        req.headers.authorization = `Bearer ${token}`;

        await autenticacao(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('deve retornar erro se o token for inválido', async () => {
        req.headers.authorization = 'Bearer invalidToken';

        await autenticacao(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    });

    it('deve retornar erro se o token não for fornecido', async () => {
        req.headers.authorization = undefined;

        await autenticacao(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    });

    it('deve passar no middleware apenasUtilizadores quando o role for Utilizador', async () => {
        req.utilizador = { role: 'Utilizador' }; // Mock do role do utilizador
        await apenasUtilizadores(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('deve retornar erro se o role não for Utilizador', async () => {
        req.utilizador = { role: 'Administrador' }; // Mock do role do utilizador
        await apenasUtilizadores(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acesso apenas permitido a utilizadores.' });
    });

    it('deve passar no middleware apenasAdministrador quando o role for Administrador', async () => {
        req.utilizador = { role: 'Administrador' }; // Mock do role do administrador
        await apenasAdministrador(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('deve retornar erro se o role não for Administrador', async () => {
        req.utilizador = { role: 'Utilizador' }; // Mock do role do utilizador
        await apenasAdministrador(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acesso apenas para administradores' });
    });

    it('deve passar no middleware apenasProprioUtilizador quando for o próprio utilizador', async () => {
        req.utilizador = { id: 1 }; // Mock do id do utilizador
        req.params.id_utilizador = '1'; // ID do utilizador na URL
        await apenasProprioUtilizador(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('deve retornar erro se o utilizador tentar acessar dados de outro utilizador', async () => {
        req.utilizador = { id: 1 }; // Mock do id do utilizador
        req.params.id_utilizador = '2'; // ID do utilizador na URL diferente
        await apenasProprioUtilizador(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Apenas o próprio utilizador pode executar esta ação.' });
    });

    it('deve passar no middleware proprioUtilizadorOuAdministrador quando for o próprio utilizador ou administrador', async () => {
        req.utilizador = { id: 1, role: 'Administrador' }; // Mock do id e role do utilizador
        req.params.id_utilizador = '1'; // ID do utilizador na URL
        await proprioUtilizadorOuAdministrador(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('deve retornar erro se o utilizador tentar acessar dados de outro utilizador e não for administrador', async () => {
        req.utilizador = { id: 1, role: 'Utilizador' }; // Mock do id e role do utilizador
        req.params.id_utilizador = '2'; // ID do utilizador na URL diferente
        await proprioUtilizadorOuAdministrador(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado: apenas o próprio utilizador ou um administrador pode executar esta ação' });
    });
});