const request = require('supertest');
const app = require('../../index'); // Aqui importamos a aplicação Express

describe('Testes de Utilizadores', () => {

    // Mock de dados de utilizador
    let tokenAdmin = null;
    let tokenUtilizador = null;
    let idUtilizador = null;

    // Realiza login do admin e utilizador antes dos testes
    beforeAll(async () => {
        // Login do administrador
        const adminLoginResponse = await request(app)
            .post('/auth/login-administrador')  // Certifique-se de que esta rota está configurada no seu app
            .send({
                email: 'admin@example.com',
                password: 'admin123'
            });
        tokenAdmin = adminLoginResponse.body.token;

        // Login do utilizador
        const userLoginResponse = await request(app)
            .post('/auth/login-utilizador')  // Certifique-se de que esta rota está configurada no seu app
            .send({
                email: 'utilizador@example.com',
                password: 'user123'
            });
        tokenUtilizador = userLoginResponse.body.token;
    });

    // Teste: Deverá retornar todos os utilizadores (apenas administrador)
    test('Deve retornar todos os utilizadores (apenas administrador)', async () => {
        const response = await request(app)
            .get('/utilizadores')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .expect(200);

        expect(response.body).toBeInstanceOf(Array); // Verificar se a resposta é um array
        expect(response.body.length).toBeGreaterThan(0); // Verificar que há pelo menos um utilizador
    });

    // Teste: Deverá retornar um utilizador pelo ID (apenas administrador)
    test('Deve retornar um utilizador pelo ID (apenas administrador)', async () => {
        const response = await request(app)
            .get('/utilizadores/1')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .expect(200);

        expect(response.body).toHaveProperty('id', 1);  // Verificar se o ID do utilizador retornado é 1
        expect(response.body).toHaveProperty('nome');  // Verificar se o utilizador tem o campo 'nome'
    });

    // Teste: Deverá permitir atualizar um utilizador (próprio utilizador ou administrador)
    test('Deve permitir atualizar um utilizador (próprio utilizador ou administrador)', async () => {
        const updatedData = { nome: 'Novo Nome' };

        const response = await request(app)
            .put('/utilizadores/1')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(updatedData)
            .expect(200);

        expect(response.body.nome).toBe(updatedData.nome); // Verificar que o nome foi atualizado
    });

    // Teste: Deverá permitir remover um utilizador (apenas administrador)
    test('Deve permitir remover um utilizador (apenas administrador)', async () => {
        const response = await request(app)
            .delete('/utilizadores/1')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .expect(200);

        expect(response.body.message).toBe('Utilizador deletado com sucesso'); // Mensagem de sucesso
    });

    // Teste: Não deve permitir que um utilizador que não é administrador acesse as rotas de admin
    test('Não deve permitir que um utilizador comum acesse as rotas de administrador', async () => {
        const response = await request(app)
            .get('/utilizadores')
            .set('Authorization', `Bearer ${tokenUtilizador}`)
            .expect(403);

        expect(response.body.error).toBe("Acesso apenas para administradores"); // Mensagem de erro
    });
});