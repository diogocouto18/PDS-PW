const {
    criarAnuncio,
    listarAnuncios,
    obterAnuncioPorId,
    encerrarAnuncio,
} = require("../Services/anuncioService");

const { criarAdministrador } = require("../Services/administradorService");
const { criarEvento } = require("../Services/eventoService");

describe("Anuncio Service", () => {

    let idAdministrador = null;
    let idEvento = null;
    let idAnuncio = null;

    beforeAll(async () => {
        const now = Date.now();

        const admin = await criarAdministrador({
            username: `admin${now}`,
            nome: "Administrador Teste",
            email: `admin${now}@example.com`,
            password_hash: "adminhash"
        });

        idAdministrador = admin.id;

        const evento = await criarEvento({
            titulo: `Evento Teste ${now}`,
            localizacao: "Local Teste",
            descricao: "Descrição de Teste",
            data_evento: new Date(),
            fotografia: "foto.jpg",
            id_administrador: idAdministrador,
            id_categoria: 1 // Atenção: Categoria deve existir na base de dados
        });

        idEvento = evento.id;

        const anuncio = await criarAnuncio({
            cargo: "Responsável pela barraca",
            descricao: "Anúncio de teste para evento",
            id_administrador: idAdministrador,
            id_evento: idEvento
        });

        idAnuncio = anuncio.id;
    });

    test("listarAnuncios deve retornar um array", async () => {
        const anuncios = await listarAnuncios(idEvento);
        expect(Array.isArray(anuncios)).toBe(true);
    });

    test("obterAnuncioPorId deve retornar o objeto correto", async () => {
        const anuncio = await obterAnuncioPorId(idAnuncio);
        expect(anuncio).toHaveProperty("id", idAnuncio);
    });

    test("encerrarAnuncio deve alterar o estado para Encerrado", async () => {
        const anuncioEncerrado = await encerrarAnuncio(idAnuncio);
        expect(anuncioEncerrado.estado).toBe("Encerrado");
    });

});