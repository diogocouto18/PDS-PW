const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

//Permite apenas utilizadores autenticados
function autenticacao(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.utilizador = decoded;
    next();
  } 
    catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

// Permite apenas utilizadores com role === 'Administrador'.
function apenasAdministrador(req, res, next) {
  if (req.utilizador?.role !== "Administrador") {
    return res.status(403).json({ error: "Acesso apenas para administradores" });
  }
  next();
}

module.exports = { 
  autenticacao, 
  apenasAdministrador 
};
