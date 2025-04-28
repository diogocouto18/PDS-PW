const rifaService = require("../Services/rifaService");

async function listarRifasPorSorteio(req, res) {
  try {
    const { id_sorteio } = req.params;
    const rifas = await rifaService.listarRifasPorSorteio(id_sorteio);
    res.json(rifas);
  } catch (err) {
    console.error("listarRifasPorSorteio:", err);
    res.status(500).json({ error: err.message });
  }
}

async function obterRifaPorId(req, res) {
  try {
    const { id } = req.params;
    const rifa = await rifaService.obterRifaPorId(id);
    if (!rifa) return res.status(404).json({ error: "Rifa não encontrada" });
    res.json(rifa);
  } catch (err) {
    console.error("obterRifaPorId:", err);
    res.status(500).json({ error: err.message });
  }
}

async function atualizarEstadoRifa(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const updated = await rifaService.atualizarEstadoRifa(id, estado);
    res.json(updated);
  } catch (err) {
    console.error("atualizarEstadoRifa:", err);
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  listarRifasPorSorteio,
  obterRifaPorId,
  atualizarEstadoRifa,
};
