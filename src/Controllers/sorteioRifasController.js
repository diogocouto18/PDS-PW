const sorteioService = require("../Services/sorteioRifasService");

// POST - Cria um novo sorteio de rifas
async function criarSorteio(req, res) {
  try {
    const data = {
      ...req.body,
      id_administrador: parseInt(req.body.id_administrador),
      id_evento: parseInt(req.body.id_evento),
    };
    const sorteio = await sorteioService.criarSorteio(data);
    res.status(201).json(sorteio);
  } catch (error) {
    console.error("criarSorteio:", error);
    res.status(400).json({ error: error.message });
  }
}

// Get - Lista todos os sorteios com as rifas associadas
async function listarSorteios(req, res) {
  try {
    const lista = await sorteioService.listarSorteios();
    res.json(lista);
  } catch (error) {
    console.error("listarSorteios:", error);
    res.status(500).json({ error: error.message });
  }
}

// Put - Atualiza campos de um sorteio existente
async function atualizarSorteio(req, res) {
  try {
    const { id } = req.params;
    const updated = await sorteioService.atualizarSorteio(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("atualizarSorteio:", error);
    res.status(400).json({ error: error.message });
  }
}

// Delete - Remove um sorteio e todas as rifas relacionadas com este sorteio
async function eliminarSorteio(req, res) {
  try {
    const { id } = req.params;
    await sorteioService.eliminarSorteio(id);
    res.json({ message: "Sorteio removido com sucesso" });
  } catch (error) {
    console.error("eliminarSorteio:", error);
    res.status(400).json({ error: error.message });
  }
}

// Post - Sortear primeiro lugar
async function sortearVencedor(req, res) {
  try {
    const { id_sorteio } = req.params;
    const vencedor = await sorteioService.sortearVencedor(id_sorteio);
    res.json(vencedor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Post - Sortear segundo lugar
async function sortearSegundoLugar(req, res) {
  try {
    const { id_sorteio } = req.params;
    const segundo = await sorteioService.sortearSegundoLugar(id_sorteio);
    res.json(segundo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Post - Sortear terceiro lugar
async function sortearTerceiroLugar(req, res) {
  try {
    const { id_sorteio } = req.params;
    const terceiro = await sorteioService.sortearTerceiroLugar(id_sorteio);
    res.json(terceiro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  criarSorteio,
  listarSorteios,
  atualizarSorteio,
  eliminarSorteio,
  sortearVencedor,
  sortearSegundoLugar,
  sortearTerceiroLugar
};
