const rifaService = require("../Services/rifaService");


// Get - Lista todos as rifas de um dado sorteio
async function listarRifasPorSorteio(req, res) {
  try {
    const { id_sorteio } = req.params;
    const rifas = await rifaService.listarRifasPorSorteio(id_sorteio);
    res.json(rifas);
  } 
    catch (error) {
    console.error("listarRifasPorSorteio:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get - Lista todos as rifas de um dado utilizador
async function listarRifasUtilizador(req, res) {
  try {
    const id_utilizador = req.utilizador.id;
    const rifas = await rifaService.listarRifasUtilizador(id_utilizador);
    res.json(rifas);
  } 
    catch (error) {
    console.error("listarMinhasRifas:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get - Obtem detalhes de uma rifa
async function obterRifaPorId(req, res) {
  try {
    const { id } = req.params;
    const rifa = await rifaService.obterRifaPorId(id);
    if (!rifa) return res.status(404).json({ error: "Rifa não encontrada" });
    res.json(rifa);
  } 
    catch (error) {
    console.error("obterRifaPorId:", error);
    res.status(500).json({ error: error.message });
  }
};

// Put - Atualiza o estado de uma rifa
async function atualizarEstadoRifa(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const updated = await rifaService.atualizarEstadoRifa(id, estado);
    res.json(updated);
  } 
    catch (error) {
    console.error("atualizarEstadoRifa:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  listarRifasPorSorteio,
  listarRifasUtilizador,
  obterRifaPorId,
  atualizarEstadoRifa,
};
