// Mocks dos middlewares de autenticação
jest.mock('../../Middlewares/authMiddlewares', () => ({
    autenticacao: (req, res, next) => next(), // Mock para autenticação
    apenasAdministrador: (req, res, next) => next(), // Mock para garantir que apenas administradores podem acessar
}));

// Mock do service de anúncios
jest.mock('../../Services/anuncioService', () => ({
    criarAnuncio: jest.fn(), // Mock para criar anúncio
    listarAnuncios: jest.fn(), // Mock para listar anúncios
    obterAnuncioPorId: jest.fn(), // Mock para obter anúncio por ID
    encerrarAnuncio: jest.fn(), // Mock para encerrar anúncio
}));

const request = require('supertest'); // Biblioteca para testar endpoints HTTP
const express = require('express'); // Framework para criar a aplicação
const anuncioService = require('../../Services/anuncioService');
const anunciosRouter = require('../../Routes/anuncios'); // Router de anúncios

// Monta app Express isolada apenas com o router de anúncios
const app = express();
app.use(express.json()); // Middleware para interpretar JSON
// Injeta req.utilizador para o POST
app.use((req, res, next) => { req.utilizador = { id: 7 }; next(); });
app.use('/anuncios', anunciosRouter); // Adiciona o router de anúncios

// Suite de testes para as rotas /anuncios
describe('Rotas /anuncios (sem BD)', () => {
    // Limpa os mocks antes de cada teste
    beforeEach(() => jest.clearAllMocks());

    // Testes para a rota POST /anuncios
    describe('POST /anuncios', () => {
        it('devolve 201 e cria anúncio', async () => {
            const mockAnuncio = { id: 1, cargo: 'Voluntário', id_administrador: 7 };
            anuncioService.criarAnuncio.mockResolvedValue(mockAnuncio);

            const res = await request(app)
                .post('/anuncios')
                .send({ cargo: 'Voluntário', descricao: 'Descrição' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockAnuncio);

            // Verifica se o serviço foi chamado com os dados corretos
            expect(anuncioService.criarAnuncio).toHaveBeenCalledWith({
                cargo: 'Voluntário',
                descricao: 'Descrição',
                id_administrador: 7,
            });
        });

        it('devolve 500 em caso de erro', async () => {
            anuncioService.criarAnuncio.mockRejectedValue(new Error('Erro criação'));

            const res = await request(app)
                .post('/anuncios')
                .send({ cargo: 'X' });

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao criar anúncio' });
        });
    });

    // Testes para a rota GET /anuncios
    describe('GET /anuncios', () => {
        it('devolve 200 e lista de anúncios por evento', async () => {
            const mockList = [{ id: 2, cargo: 'Teste', id_evento: '3' }];
            anuncioService.listarAnuncios.mockResolvedValue(mockList);

            const res = await request(app).get('/anuncios?id_evento=3');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockList);

            // Verifica se o serviço foi chamado com o ID correto
            expect(anuncioService.listarAnuncios).toHaveBeenCalledWith('3');
        });

        it('devolve 500 em caso de erro', async () => {
            anuncioService.listarAnuncios.mockRejectedValue(new Error('Erro listar'));

            const res = await request(app).get('/anuncios?id_evento=3');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar anúncios' });
        });
    });

    // Testes para a rota GET /anuncios/:id
    describe('GET /anuncios/:id', () => {
        it('devolve 200 e anúncio existente', async () => {
            const mockAnuncio = { id: 5, cargo: 'Teste' };
            anuncioService.obterAnuncioPorId.mockResolvedValue(mockAnuncio);

            const res = await request(app).get('/anuncios/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockAnuncio);

            // Verifica se o serviço foi chamado com o ID correto
            expect(anuncioService.obterAnuncioPorId).toHaveBeenCalledWith('5');
        });

        it('devolve 404 se não existir', async () => {
            anuncioService.obterAnuncioPorId.mockResolvedValue(null);

            const res = await request(app).get('/anuncios/999');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Anúncio não encontrado' });
        });

        it('devolve 500 em caso de erro', async () => {
            anuncioService.obterAnuncioPorId.mockRejectedValue(new Error('Erro buscar'));

            const res = await request(app).get('/anuncios/5');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao buscar anúncio' });
        });
    });

    // Testes para a rota PUT /anuncios/:id/encerrar
    describe('PUT /anuncios/:id/encerrar', () => {
        it('devolve 200 e anúncio encerrado', async () => {
            const mockEnc = { id: 6, estado: 'Terminado' };
            anuncioService.encerrarAnuncio.mockResolvedValue(mockEnc);

            const res = await request(app).put('/anuncios/6/encerrar');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockEnc);

            // Verifica se o serviço foi chamado com o ID correto
            expect(anuncioService.encerrarAnuncio).toHaveBeenCalledWith('6');
        });

        it('devolve 500 em caso de erro', async () => {
            anuncioService.encerrarAnuncio.mockRejectedValue(new Error('Erro encerrar'));

            const res = await request(app).put('/anuncios/7/encerrar');

            // Verifica se o status e o corpo da resposta estão corretos
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Erro ao encerrar anúncio' });
        });
    });
});