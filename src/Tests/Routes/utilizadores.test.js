/**
 * src/Tests/Routes/utilizadores.test.js
 *
 * Testes de rota/controllers para Utilizadores (sem BD real),
 * mockando o service para isolar controller + routes.
 */

// Mock do service antes de importar o app
jest.mock('../../Services/utilizadorService');
const utilizadorService = require('../../Services/utilizadorService');
const request = require('supertest');
const app = require('../../index');

describe('Rotas /utilizadores (sem BD)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /utilizadores', () => {
        it('devolve 200 e lista de utilizadores', async () => {
            const mockLista = [
                { id: 1, username: 'u1', nome: 'U Um', email: 'u1@teste.com', telefone: '911111111' },
                { id: 2, username: 'u2', nome: 'U Dois', email: 'u2@teste.com', telefone: '922222222' }
            ];
            utilizadorService.listarUtilizadores.mockResolvedValue(mockLista);

            const res = await request(app).get('/utilizadores');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockLista);
            expect(utilizadorService.listarUtilizadores).toHaveBeenCalled();
        });

        it('devolve 500 em caso de erro', async () => {
            utilizadorService.listarUtilizadores.mockRejectedValue(new Error('Falha no serviço'));

            const res = await request(app).get('/utilizadores');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar utilizadores' });
        });
    });

    describe('GET /utilizadores/:id', () => {
        it('devolve 200 e o utilizador quando existe', async () => {
            const mockUser = { id: 1, username: 'u1', nome: 'U Um', email: 'u1@teste.com', telefone: '911111111' };
            utilizadorService.obterPorId.mockResolvedValue(mockUser);

            const res = await request(app).get('/utilizadores/1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUser);
            expect(utilizadorService.obterPorId).toHaveBeenCalledWith('1');
        });

        it('devolve 404 se não existir', async () => {
            utilizadorService.obterPorId.mockResolvedValue(null);

            const res = await request(app).get('/utilizadores/999');
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Utilizador não encontrado' });
        });

        it('devolve 500 em caso de erro', async () => {
            utilizadorService.obterPorId.mockRejectedValue(new Error('Erro inesperado'));

            const res = await request(app).get('/utilizadores/1');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar utilizador' });
        });
    });

    describe('PUT /utilizadores/:id', () => {
        it('devolve 200 e o utilizador atualizado', async () => {
            const updateData = { nome: 'Novo Nome', morada: 'Nova Rua, 99' };
            const mockUpdated = { id: 1, username: 'u1', nome: 'Novo Nome', email: 'u1@teste.com', telefone: '911111111', morada: 'Nova Rua, 99' };
            utilizadorService.atualizarUtilizadores.mockResolvedValue(mockUpdated);

            const res = await request(app)
                .put('/utilizadores/1')
                .send(updateData);
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdated);
            expect(utilizadorService.atualizarUtilizadores).toHaveBeenCalledWith('1', updateData);
        });

        it('devolve 500 em caso de erro', async () => {
            utilizadorService.atualizarUtilizadores.mockRejectedValue(new Error('Erro no update'));

            const res = await request(app)
                .put('/utilizadores/1')
                .send({ nome: 'X' });
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao atualizar utilizador' });
        });
    });

    describe('DELETE /utilizadores/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            utilizadorService.eliminarUtilizadores.mockResolvedValue(undefined);

            const res = await request(app).delete('/utilizadores/1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Utilizador deletado com sucesso' });
            expect(utilizadorService.eliminarUtilizadores).toHaveBeenCalledWith('1');
        });

        it('devolve 500 em caso de erro', async () => {
            utilizadorService.eliminarUtilizadores.mockRejectedValue(new Error('Erro no delete'));

            const res = await request(app).delete('/utilizadores/1');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao deletar utilizador' });
        });
    });
});

