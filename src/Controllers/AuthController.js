const authService = require("../services/authService");

const register = async (req, res) => {
    try {
        const novoUtilizador = await authService.register(req.body);
        res.status(201).json(novoUtilizador);
    } catch (error) {
        console.error("Erro no registro:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.json({ token });
    } catch (error) {
        console.error("Erro no login:", error.message);
        res.status(401).json({ error: error.message });
    }
};

module.exports = { register, login };
