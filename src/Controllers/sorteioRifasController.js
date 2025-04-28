const compraRifaService = require("../Services/compraRifaService");

exports.criarCompra = async (req, res) => {
    try {
        const data = {
            id_utilizador: req.user.id, // Pegamos do token JWT
            id_rifa: req.body.id_rifa,
            quantidade: req.body.quantidade,
        };
        const novaCompra = await compraRifaService.criarCompra(data);
        res.status(201).json(novaCompra);
    } catch (error) {
        console.error("Erro ao criar compra de rifa:", error);
        res.status(400).json({ error: error.message || "Erro ao comprar rifa" });
    }
};

exports.listarCompras = async (req, res) => {
    try {
        const compras = await compraRifaService.listarCompras();
        res.json(compras);
    } catch (error) {
        console.error("Erro ao listar compras:", error);
        res.status(500).json({ error: "Erro ao buscar compras" });
    }
};