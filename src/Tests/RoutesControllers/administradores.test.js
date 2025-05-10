// Faz mock dos middlewares de autenticação para sempre chamar next()
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(),
    apenasAdministrador: (req, res, next) => next(),
}));

// Faz mock do service para podermos controlar o seu comportamento
jest.mock('../../Services/administradorService');

const request = require('supertest');
const express = require('express');

// Importa o service mockado
const administradorService = require('../../Services/administradorService');

// Importa o router das rotas de administradores
const administradoresRouter = require('../../Routes/administradores');

describe('Rotas /administradores (sem BD)', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/administradores', administradoresRouter);
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('GET /administradores', () => {
        it('devolve 200 e lista de administradores', async () => {
            const mockLista = [
                { id: 1, nome: 'Admin Um', email: 'a1@teste.com' },
                { id: 2, nome: 'Admin Dois', email: 'a2@teste.com' },
            ];
            administradorService.listarAdministradores.mockResolvedValue(mockLista);

            const res = await request(app).get('/administradores');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLista);
            expect(administradorService.listarAdministradores).toHaveBeenCalled();
        });

        it('devolve 500 em caso de erro', async () => {
            administradorService.listarAdministradores.mockRejectedValue(new Error('Falha no serviço'));

            const res = await request(app).get('/administradores');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar administradores' });
        });
    });

    describe('GET /administradores/:id', () => {
        it('devolve 200 e o administrador quando existe', async () => {
            const mockAdmin = { id: 1, nome: 'Admin Um', email: 'a1@teste.com' };
            administradorService.obterPorId.mockResolvedValue(mockAdmin);

            const res = await request(app).get('/administradores/1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockAdmin);
            expect(administradorService.obterPorId).toHaveBeenCalledWith('1');
        });

        it('devolve 404 se não existir', async () => {
            administradorService.obterPorId.mockResolvedValue(null);

            const res = await request(app).get('/administradores/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Administrador não encontrado' });
        });

        it('devolve 500 em caso de erro', async () => {
            administradorService.obterPorId.mockRejectedValue(new Error('Erro inesperado'));

            const res = await request(app).get('/administradores/1');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar administrador' });
        });
    });

    describe('PUT /administradores/:id', () => {
        it('devolve 200 e o administrador atualizado', async () => {
            const updateData = { nome: 'Novo Nome' };
            const mockUpdated = { id: 1, nome: 'Novo Nome', email: 'a1@teste.com' };
            administradorService.atualizarAdministradores.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/administradores/1')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);
            expect(administradorService.atualizarAdministradores)
                .toHaveBeenCalledWith('1', updateData);
        });

        it('devolve 500 em caso de erro', async () => {
            administradorService.atualizarAdministradores.mockRejectedValue(new Error('Falha ao atualizar'));

            const res = await request(app)
                .put('/administradores/1')
                .send({ nome: 'X' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao atualizar administrador' });
        });
    });

    describe('DELETE /administradores/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            administradorService.eliminarAdministradores.mockResolvedValue();

            const res = await request(app).delete('/administradores/1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Administrador deletado com sucesso' });
            expect(administradorService.eliminarAdministradores).toHaveBeenCalledWith('1');
        });

        it('devolve 500 em caso de erro', async () => {
            administradorService.eliminarAdministradores.mockRejectedValue(new Error('Erro ao deletar'));

            const res = await request(app).delete('/administradores/1');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao deletar administrador' });
        });
    });
});