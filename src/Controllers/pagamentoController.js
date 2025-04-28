const pagamentoService = require("../Services/pagamentoService");

async function comprarRifas(req, res) {
  try {
    // espera body: { id_utilizador, id_sorteioRifas, quantidadeCompra, metodo_pagamento }
    const { id_utilizador, id_sorteioRifas, quantidadeCompra, metodo_pagamento } = req.body;
    const pagamento = await pagamentoService.comprarRifas(
      parseInt(id_utilizador, 10),
      parseInt(id_sorteioRifas, 10),
      parseInt(quantidadeCompra, 10),
      metodo_pagamento
    );
    res.status(201).json(pagamento);
  } catch (err) {
    console.error("comprarRifas:", err);
    res.status(400).json({ error: err.message });
  }
}

module.exports = { 
    comprarRifas 
};
