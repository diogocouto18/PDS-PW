const {
    criarAdministrador,
    listarAdministradores,
    obterPorId,
    atualizarAdministradores,
    eliminarAdministradores
} = require("../Services/administradorService");

describe("Administrador Service", () => {

    let idAdministradorTemp = null;

    test("listarAdministradores deve retornar um array", async () => {
        const administradores = await listarAdministradores();
        expect(Array.isArray(administradores)).toBe(true);
    });

    test("criarAdministrador deve criar um administrador", async () => {
        const novoAdministrador = await criarAdministrador({
            username: "adminTeste",
            nome: "Administrador Teste",
            email: "admin.teste@example.com",
            password_hash: "hash_fake"
        });

        expect(novoAdministrador).toHaveProperty("id");
        idAdministradorTemp = novoAdministrador.id;
    });

    test("obterPorId deve retornar um objeto ou null", async () => {
        const administrador = await obterPorId(idAdministradorTemp);
        expect(administrador === null || typeof administrador === "object").toBe(true);
    });

    test("atualizarAdministradores deve modificar dados corretamente", async () => {
        const atualizado = await atualizarAdministradores(idAdministradorTemp, {
            username: "adminAtualizado",
            nome: "Administrador Atualizado",
            email: "admin.atualizado@example.com",
            password_hash: "hash_atualizado"
        });

        expect(atualizado.username).toBe("adminAtualizado");
    });

    test("eliminarAdministradores deve remover o administrador", async () => {
        await eliminarAdministradores(idAdministradorTemp);

        const administradorDepois = await obterPorId(idAdministradorTemp);
        expect(administradorDepois).toBeNull();
    });

});