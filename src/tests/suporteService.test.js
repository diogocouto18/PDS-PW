const {
    criarArtigo,
    listarArtigos,
    obterArtigoPorId,
    atualizarArtigo,
    eliminarArtigo
} = require("../Services/suporteService");

describe("Suporte Service", () => {

    test("listarArtigos deve retornar um array", async () => {
        const artigos = await listarArtigos();
        expect(Array.isArray(artigos)).toBe(true);
    });

    test("obterArtigoPorId deve retornar null ou um objeto", async () => {
        const artigo = await obterArtigoPorId(99999); // ID provavelmente inexistente
        expect(artigo === null || typeof artigo === "object").toBe(true);
    });

    test("criar e eliminar um artigo temporário", async () => {
        const novoArtigo = await criarArtigo({
            artigo: "Problema Teste",
            descricao: "Descrição teste do problema."
        });

        expect(novoArtigo).toHaveProperty("id");

        const artigoId = novoArtigo.id;

        const artigoAntes = await obterArtigoPorId(artigoId);
        expect(artigoAntes).not.toBeNull();

        await eliminarArtigo(artigoId);

        const artigoDepois = await obterArtigoPorId(artigoId);
        expect(artigoDepois).toBeNull();
    });

    test("atualizarArtigo deve modificar os dados corretamente", async () => {
        const artigoTemp = await criarArtigo({
            artigo: "Artigo Temporário",
            descricao: "Descrição inicial."
        });

        const atualizado = await atualizarArtigo(artigoTemp.id, {
            artigo: "Artigo Atualizado",
            descricao: "Descrição atualizada."
        });

        expect(atualizado.artigo).toBe("Artigo Atualizado");

        await eliminarArtigo(artigoTemp.id);
    });

});