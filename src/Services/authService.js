const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

// Regista um utilizador
const registerUtilizador= async (data) => {
    // 1. Verifica email duplicado
    const existente = await prisma.utilizador.findUnique({
        where: { email: data.email },
    });
    if (existente) {
        throw new Error("Email já registrado");
    }

    // 2. Hash da password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Regista o utilizador
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

// Regista um Administrador
const registerAdministrador= async (data) => {
    // 1. Verifica email duplicado
    const existente = await prisma.administrador.findUnique({
        where: { email: data.email },
    });
    if (existente) {
        throw new Error("Email já registrado");
    }

    // 2. Hash da password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Regista o administrador
    const novoAdministrador = await prisma.administrador.create({
        data: {
            username: data.username,
            nome: data.nome,
            email: data.email,
            password_hash: hashedPassword,
        },
    });
    return novoAdministrador;
};

// Login do Utilizador
const loginUtilizador = async (data) => {
    
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
    
    const token = jwt.sign(
        { id: utilizador.id, email: utilizador.email, role: "Utilizador"},
        JWT_SECRET,
        { expiresIn: "2h" }
    );
    return token;
};

// Login do administrador
const loginAdministrador = async (data) => {
    
    const administrador = await prisma.administrador.findUnique({
        where: { email: data.email },
    });
    if (!administrador) {
        throw new Error("Administrador não encontrado");
    }
    const passwordValida = await bcrypt.compare(data.password, administrador.password_hash);
    if (!passwordValida) {
        throw new Error("Password inválida");
    }
    
    const token = jwt.sign(
        { id: administrador.id, email: administrador.email, role: "Administrador" },
        JWT_SECRET,
        { expiresIn: "2h" }
    );
    return token;
};


module.exports = { 
    registerUtilizador, 
    registerAdministrador,
    loginUtilizador,
    loginAdministrador,
};
