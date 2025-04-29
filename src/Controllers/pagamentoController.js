const pagamentoService = require("../Services/pagamentoService");

// POST - Cria um pagamento com um nº de rifas de um sorteio
async function comprarRifas(req, res) {
  try {
    const { id_utilizador, id_sorteio, quantidadeCompra, metodo_pagamento } = req.body;
    const pagamento = await pagamentoService.comprarRifas(
      parseInt(id_utilizador),
      parseInt(id_sorteio),
      parseInt(quantidadeCompra),
      metodo_pagamento
    );
    res.status(201).json(pagamento);
  } 
    catch (error) {
    console.error("comprarRifas:", error);
    res.status(400).json({ error: error.message });
  }
}

module.exports = { 
    comprarRifas 
};
