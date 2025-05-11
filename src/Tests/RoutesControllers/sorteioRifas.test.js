// Mocks dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock para autenticação
    apenasAdministrador: (req, res, next) => next(), // Mock para autorização de administradores
}));

// Mock do service de sorteio de rifas
jest.mock('../../Services/sorteioRifasService', () => ({
    criarSorteio: jest.fn(), // Mock para criar sorteios
    listarSorteios: jest.fn(), // Mock para listar sorteios
    atualizarSorteio: jest.fn(), // Mock para atualizar sorteios
    eliminarSorteio: jest.fn(), // Mock para eliminar sorteios
    sortearVencedor: jest.fn(), // Mock para sortear vencedor
    sortearSegundoLugar: jest.fn(), // Mock para sortear segundo lugar
    sortearTerceiroLugar: jest.fn(), // Mock para sortear terceiro lugar
}));
const sorteioService = require('../../Services/sorteioRifasService');

const request = require('supertest'); // Biblioteca para testar endpoints HTTP
const express = require('express'); // Framework para criar a aplicação
const sorteioRouter = require('../../Routes/sorteioRifas'); // Router de sorteio de rifas

// Monta app Express isolada apenas com o router de sorteio de rifas
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
app.use('/sorteio-rifas', sorteioRouter); // Adiciona o router de sorteio de rifas

// Suite de testes para as rotas /sorteio-rifas
describe('Rotas /sorteio-rifas (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota POST /sorteio-rifas
    describe('POST /sorteio-rifas', () => {
        it('devolve 201 e cria sorteio', async () => {
            const mockSort = {
                id: 1,
                nome: 'S1',
                preco: '10.00',
                quantidadeTotal: 100,
                premio: 'Premio',
                id_administrador: 2,
                id_evento: 3,
                data_sorteio: '2025-07-01',
            };
            sorteioService.criarSorteio.mockResolvedValue(mockSort);

            const res = await request(app)
                .post('/sorteio-rifas')
                .send({
                    nome: 'S1',
                    preco: '10.00',
                    quantidadeTotal: 100,
                    descricao: 'Desc',
                    premio: 'Premio',
                    id_administrador: '2',
                    id_evento: '3',
                    data_sorteio: '2025-07-01',
                });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockSort);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(sorteioService.criarSorteio).toHaveBeenCalledWith({
                nome: 'S1',
                preco: '10.00',
                quantidadeTotal: 100,
                descricao: 'Desc',
                premio: 'Premio',
                id_administrador: 2,
                id_evento: 3,
                data_sorteio: '2025-07-01',
            });
        });

        it('devolve 400 em caso de erro', async () => {
            sorteioService.criarSorteio.mockRejectedValue(new Error('Falha criar'));

            const res = await request(app)
                .post('/sorteio-rifas')
                .send({ nome: 'X' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Falha criar' });
        });
    });

    // Testes para a rota GET /sorteio-rifas
    describe('GET /sorteio-rifas', () => {
        it('devolve 200 e lista de sorteios', async () => {
            const mockList = [{ id: 1, nome: 'S1' }];
            sorteioService.listarSorteios.mockResolvedValue(mockList);

            const res = await request(app).get('/sorteio-rifas');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);

            // Verifica se o serviço foi chamado
            expect(sorteioService.listarSorteios).toHaveBeenCalled();
        });

        it('devolve 500 em caso de erro', async () => {
            sorteioService.listarSorteios.mockRejectedValue(new Error('Falha listar'));

            const res = await request(app).get('/sorteio-rifas');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Falha listar' });
        });
    });

    // Testes para a rota PUT /sorteio-rifas/:id
    describe('PUT /sorteio-rifas/:id', () => {
        it('devolve 200 e sorteio atualizado', async () => {
            const mockUpd = { id: 2, nome: 'Atualizado' };
            sorteioService.atualizarSorteio.mockResolvedValue(mockUpd);

            const res = await request(app)
                .put('/sorteio-rifas/2')
                .send({ nome: 'Atualizado' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpd);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(sorteioService.atualizarSorteio).toHaveBeenCalledWith('2', { nome: 'Atualizado' });
        });

        it('devolve 400 em caso de erro', async () => {
            sorteioService.atualizarSorteio.mockRejectedValue(new Error('Erro update'));

            const res = await request(app)
                .put('/sorteio-rifas/3')
                .send({ nome: 'X' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erro update' });
        });
    });

    // Testes para a rota DELETE /sorteio-rifas/:id
    describe('DELETE /sorteio-rifas/:id', () => {
        it('devolve 200 em caso de sucesso', async () => {
            sorteioService.eliminarSorteio.mockResolvedValue();

            const res = await request(app).delete('/sorteio-rifas/4');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Sorteio removido com sucesso' });

            // Verifica se o serviço foi chamado com o ID correto
            expect(sorteioService.eliminarSorteio).toHaveBeenCalledWith('4');
        });

        it('devolve 400 em caso de erro', async () => {
            sorteioService.eliminarSorteio.mockRejectedValue(new Error('Erro delete'));

            const res = await request(app).delete('/sorteio-rifas/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erro delete' });
        });
    });

    // Testes para as rotas de sorteio de vencedores
    describe('POST /sorteio-rifas/:id_sorteio/sortear/vencedor', () => {
        it('devolve 200 e vencedor', async () => {
            const mockV = { id: 6, vencedor: 7 };
            sorteioService.sortearVencedor.mockResolvedValue(mockV);

            const res = await request(app).post('/sorteio-rifas/6/sortear/vencedor');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockV);

            // Verifica se o serviço foi chamado com o ID correto
            expect(sorteioService.sortearVencedor).toHaveBeenCalledWith('6');
        });

        it('devolve 400 em caso de erro', async () => {
            sorteioService.sortearVencedor.mockRejectedValue(new Error('Erro sortear'));

            const res = await request(app).post('/sorteio-rifas/7/sortear/vencedor');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erro sortear' });
        });
    });

    // Testes para as rotas de sorteio de segundo lugar
    describe('POST /sorteio-rifas/:id_sorteio/sortear/segundo', () => {
        it('devolve 200 e segundo lugar', async () => {
            const mockS = { id: 8, segundo: 9 };
            sorteioService.sortearSegundoLugar.mockResolvedValue(mockS);

            const res = await request(app).post('/sorteio-rifas/8/sortear/segundo');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockS);
            expect(sorteioService.sortearSegundoLugar).toHaveBeenCalledWith('8');
        });

        it('devolve 400 em caso de erro', async () => {
            sorteioService.sortearSegundoLugar.mockRejectedValue(new Error('Erro segundo'));

            const res = await request(app).post('/sorteio-rifas/9/sortear/segundo');
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erro segundo' });
        });
    });

    // Testes para as rotas de sorteio de terceiro lugar
    describe('POST /sorteio-rifas/:id_sorteio/sortear/terceiro', () => {
        it('devolve 200 e terceiro lugar', async () => {
            const mockT = { id: 10, terceiro: 11 };
            sorteioService.sortearTerceiroLugar.mockResolvedValue(mockT);

            const res = await request(app).post('/sorteio-rifas/10/sortear/terceiro');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockT);
            expect(sorteioService.sortearTerceiroLugar).toHaveBeenCalledWith('10');
        });

        it('devolve 400 em caso de erro', async () => {
            sorteioService.sortearTerceiroLugar.mockRejectedValue(new Error('Erro terceiro'));

            const res = await request(app).post('/sorteio-rifas/11/sortear/terceiro');
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Erro terceiro' });
        });
    });
});