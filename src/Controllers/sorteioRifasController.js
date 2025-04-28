const sorteioService = require("../Services/sorteioRifasService");

async function criarSorteio(req, res) {
  try {
    // espera body: { nome, preco, quantidadeTotal, descricao, premio, data_sorteio, id_administrador, id_evento }
    const data = {
      ...req.body,
      // se quiseres extrair admin/evento do token, podes substituir estes:
      id_administrador: parseInt(req.body.id_administrador, 10),
      id_evento: parseInt(req.body.id_evento, 10),
    };
    const sorteio = await sorteioService.criarSorteio(data);
    res.status(201).json(sorteio);
  } catch (err) {
    console.error("criarSorteio:", err);
    res.status(400).json({ error: err.message });
  }
}

async function listarSorteios(req, res) {
  try {
    const lista = await sorteioService.listarSorteios();
    res.json(lista);
  } catch (err) {
    console.error("listarSorteios:", err);
    res.status(500).json({ error: err.message });
  }
}

async function atualizarSorteio(req, res) {
  try {
    const { id } = req.params;
    const updated = await sorteioService.atualizarSorteio(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error("atualizarSorteio:", err);
    res.status(400).json({ error: err.message });
  }
}

async function eliminarSorteio(req, res) {
  try {
    const { id } = req.params;
    await sorteioService.eliminarSorteio(id);
    res.json({ message: "Sorteio removido com sucesso" });
  } catch (err) {
    console.error("eliminarSorteio:", err);
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  criarSorteio,
  listarSorteios,
  atualizarSorteio,
  eliminarSorteio,
};
