const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//Permite apenas utilizadores autenticados
async function autenticacao(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === "Administrador") {
      const administrador = await prisma.administrador.findUnique({
        where: { id: decoded.id },
      });
      if (!administrador || !administrador.ativo) {
        return res.status(403).json({ error: "Administrador desativado" });
      }
    }
    req.utilizador = decoded;
    next();
  } 
    catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// Permite apenas utilizadores com role === 'Utilizador'.
function apenasUtilizadores(req, res, next) {
  if (req.utilizador?.role !== "Utilizador") {
    return res.status(403).json({ error: "Acesso apenas permitido a utilizadores." });
  }
  next();
};

// Permite apenas utilizadores com role === 'Administrador'.
function apenasAdministrador(req, res, next) {
  if (req.utilizador?.role !== "Administrador") {
    return res.status(403).json({ error: "Acesso apenas para administradores" });
  }
  next();
};

// Função que valide apenas coisas relacionadas com o própio utilizador
function apenasProprioUtilizador(req, res, next) {
  const utlizadorIdToken = req.utilizador?.id;
  const utilizadorIdParam = parseInt(req.params.id_utilizador || req.body.id_utilizador);

  if (utlizadorIdToken === utilizadorIdParam) {
    return next();
  }

  return res.status(403).json({ error: "Apenas o próprio utilizador pode executar esta ação." });
};


// Função que valide apenas objetos relacionadas com o própio utilizador ou o administrador
function proprioUtilizadorOuAdministrador(req, res, next) {
  const utilizadorIdToken = req.utilizador?.id;
  const role = req.utilizador?.role;
  const utilizadorIdParam = parseInt(req.params.id_utilizador || req.body.id_utilizador);

  if (!isNaN(utilizadorIdParam) && (utilizadorIdToken === utilizadorIdParam || role === "Administrador")) {
    return next();
  }

  return res.status(403).json({ error: "Acesso negado: apenas o próprio utilizador ou um administrador pode executar esta ação" });
};


module.exports = { 
  autenticacao,
  apenasUtilizadores, 
  apenasAdministrador,
  apenasProprioUtilizador,
  proprioUtilizadorOuAdministrador 
};
