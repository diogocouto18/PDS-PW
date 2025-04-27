const {
    criarMensagemInicial,
    enviarResposta,
    fecharTicket,
    listarMensagensDoTicket
} = require("../Services/mensagemSuporteService");

const { criarUtilizador } = require("../Services/utilizadorService");

describe("Mensagem Suporte Service", () => {

    let idTicketGerado = null;
    let idUtilizadorTest = null;

    beforeAll(async () => {
        const now = Date.now();
        const idRandom = Math.floor(Math.random() * 1000000);

        const utilizador = await criarUtilizador({
            username: `testsuporte${now}`,
            nome: "Teste Suporte",
            email: `testesuporte_${now}@example.com`,
            telefone: `9${now.toString().slice(0, 8)}`,
            password_hash: "hash_fake",
            morada: "Rua de Testes"
        });

        idUtilizadorTest = utilizador.id;
        idTicketGerado = idRandom; // guardar id_ticket seguro

        await criarMensagemInicial({
            id_ticket: idTicketGerado,
            id_utilizador: idUtilizadorTest,
            mensagem: "Mensagem inicial de teste"
        });
    });

    test("listarMensagensDoTicket deve retornar um array", async () => {
        const mensagens = await listarMensagensDoTicket(idTicketGerado);
        expect(Array.isArray(mensagens)).toBe(true);
    });

    test("enviarResposta deve adicionar nova mensagem", async () => {
        const resposta = await enviarResposta({
            id_ticket: idTicketGerado,
            id_utilizador: idUtilizadorTest,
            mensagem: "Resposta de teste para o ticket"
        });

        expect(resposta).toHaveProperty("id");
    });

    test("fecharTicket deve fechar todas as mensagens abertas", async () => {
        const resultado = await fecharTicket(idTicketGerado);
        expect(Array.isArray(resultado)).toBe(true);
        expect(resultado.length).toBeGreaterThan(0);
    });

});