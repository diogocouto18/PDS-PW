const notificacaoService = require("../Services/notificacaoService");

// Criar notificação
async function criarNotificacao(req, res) {
  try {
    const nova = await notificacaoService.criarNotificacao(req.body);
    res.status(201).json(nova);
  } catch (error) {
    console.error("Erro ao criar notificação:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Listar notificações por utilizador
async function listarNotificacoesPorUtilizador(req, res) {
  try {
    const notificacoes = await notificacaoService.listarNotificacoesPorUtilizador(req.params.id_utilizador);
    res.json(notificacoes);
  } catch (error) {
    console.error("Erro ao listar notificações:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Listar notificações por administrador
async function listarNotificacoesPorAdministrador(req, res) {
  try {
    const notificacoes = await notificacaoService.listarNotificacoesPorAdministrador(req.params.id_administrador);
    res.json(notificacoes);
  } catch (error) {
    console.error("Erro ao listar notificações:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Marcar notificação como aberta
async function abrirNotificacao(req, res) {
  try {
    const not = await notificacaoService.abrirNotificacao(req.params.id);
    res.json(not);
  } catch (error) {
    console.error("Erro ao abrir notificação:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Apagar notificação (opcional)
async function apagarNotificacao(req, res) {
  try {
    await notificacaoService.apagarNotificacao(req.params.id);
    res.json({ message: "Notificação apagada com sucesso" });
  } catch (error) {
    console.error("Erro ao apagar notificação:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  criarNotificacao,
  listarNotificacoesPorUtilizador,
  listarNotificacoesPorAdministrador,
  abrirNotificacao,
  apagarNotificacao,
};
