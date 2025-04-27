const authService = require("../Services/authService");

async function registerUtilizador(req, res) {
  try {
    const novo = await authService.registerUtilizador(req.body);
    res.status(201).json(novo);
  } catch (error) {
    console.error("Erro no registro:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function registerAdministrador(req, res) {
  try {
    const novo = await authService.registerAdministrador(req.body);
    res.status(201).json(novo);
  } catch (error) {
    console.error("Erro no registro:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function loginUtilizador(req, res) {
  try {
    const token = await authService.loginUtilizador(req.body);
    res.json({ token });
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(401).json({ error: error.message });
  }
}

async function loginAdministrador(req, res) {
  try {
    const token = await authService.loginAdministrador(req.body);
    res.json({ token });
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(401).json({ error: error.message });
  }
}

module.exports = { 
  registerUtilizador, 
  registerAdministrador,
  loginUtilizador,
  loginAdministrador,
};