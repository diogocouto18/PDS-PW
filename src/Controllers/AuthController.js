const authService = require("../Services/authService");

// Post - Cria conta de um Utilizador
async function registerUtilizador(req, res) {
  try {
    const novo = await authService.registerUtilizador(req.body);
    return res.status(201).json(novo);
  } catch (error) {
    console.error("Erro no registro:", error.message);
    return res.status(400).json({ error: error.message });
  }
}

// Post - Cria conta de um Administrador
async function registerAdministrador(req, res) {
  try {
    // Passphrase obrigatória e incorreta é tratada pelo service
    const novo = await authService.registerAdministrador(req.body);
    return res.status(201).json(novo);
  } catch (error) {
    console.error("Erro no registro:", error.message);
    return res.status(400).json({ error: error.message });
  }
}

// Post - Login de um Utilizador
async function loginUtilizador(req, res) {
  try {
    const { token, role, id } = await authService.loginUtilizador(req.body);
    return res.status(200).json({ token, role, id });
  } catch (error) {
    console.error("Erro no login:", error.message);
    return res.status(401).json({ error: error.message });
  }
}

// Post - Login de um Administrador
async function loginAdministrador(req, res) {
  try {
    const { token, role, id } = await authService.loginAdministrador(req.body);
    return res.status(200).json({ token, role, id });
  } catch (error) {
    console.error("Erro no login:", error.message);
    return res.status(401).json({ error: error.message });
  }
}

module.exports = {
  registerUtilizador,
  registerAdministrador,
  loginUtilizador,
  loginAdministrador,
};
