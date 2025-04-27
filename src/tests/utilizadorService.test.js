const {
    criarUtilizador,
    listarUtilizadores,
    obterPorId,
    atualizarUtilizadores,
    eliminarUtilizadores
} = require("../Services/utilizadorService");

describe("Utilizador Service", () => {

    test("listarUtilizadores deve retornar um array", async () => {
        const utilizadores = await listarUtilizadores();
        expect(Array.isArray(utilizadores)).toBe(true);
    });

    test("obterPorId deve retornar null ou um objeto", async () => {
        const utilizador = await obterPorId(99999); // ID provavelmente inexistente
        expect(utilizador === null || typeof utilizador === "object").toBe(true);
    });

    test("criar e eliminar um utilizador temporário", async () => {
        const novoUtilizador = await criarUtilizador({
            username: "testuser",
            nome: "Test User",
            email: "testuser@example.com",
            telefone: "123456789",
            password_hash: "hashfake",
            morada: "Rua de Testes, 123"
        });

        expect(novoUtilizador).toHaveProperty("id");

        const utilizadorId = novoUtilizador.id;

        const utilizadorAntes = await obterPorId(utilizadorId);
        expect(utilizadorAntes).not.toBeNull();

        await eliminarUtilizadores(utilizadorId);

        const utilizadorDepois = await obterPorId(utilizadorId);
        expect(utilizadorDepois).toBeNull();
    });

    test("atualizarUtilizadores deve modificar dados corretamente", async () => {
        const utilizadorTemp = await criarUtilizador({
            username: "tempuser",
            nome: "Temp User",
            email: "tempuser@example.com",
            telefone: "987654321",
            password_hash: "temphash",
            morada: "Rua Temporária, 321"
        });

        const atualizado = await atualizarUtilizadores(utilizadorTemp.id, {
            nome: "Temp User Atualizado"
        });

        expect(atualizado.nome).toBe("Temp User Atualizado");

        await eliminarUtilizadores(utilizadorTemp.id);
    });

});