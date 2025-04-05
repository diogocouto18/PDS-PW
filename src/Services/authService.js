const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

const register = async (data) => {
    // data: { username, nome, email, telefone, password, morada }
    // Verifica se o email já existe (opcional)
    const existente = await prisma.utilizador.findUnique({
        where: { email: data.email },
    });
    if (existente) {
        throw new Error("Email já registrado");
    }

    // Hashear a password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Cria o utilizador no banco de dados (observe que o campo na BD pode ser "password_hash")
    const novoUtilizador = await prisma.utilizador.create({
        data: {
            username: data.username,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            password_hash: hashedPassword,
            morada: data.morada,
        },
    });
    return novoUtilizador;
};

const login = async (data) => {
    // data: { email, password }
    const utilizador = await prisma.utilizador.findUnique({
        where: { email: data.email },
    });
    if (!utilizador) {
        throw new Error("Utilizador não encontrado");
    }
    const passwordValida = await bcrypt.compare(data.password, utilizador.password_hash);
    if (!passwordValida) {
        throw new Error("Password inválida");
    }
    // Gera o token com informações mínimas (ex: id e email)
    const token = jwt.sign(
        { id: utilizador.id, email: utilizador.email },
        JWT_SECRET,
        { expiresIn: "2h" }
    );
    return token;
};

module.exports = { register, login };
