const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";
const ADMINISTRADOR_PASSPHRASE = process.env.ADMINISTRADOR_PASSPHRASE;

// Regista um utilizador
const registerUtilizador= async (data) => {
    
    // 1. Verifica se o nome de utilizador é duplicado
    const nomeUtilizador = await prisma.utilizador.findUnique({
        where: { username: data.username },
    });
    const nomeAdministrador = await prisma.administrador.findUnique({
        where: { username: data.username },
    });
    if (nomeUtilizador || nomeAdministrador) {
        throw new Error("Nome de Utilizador já registado");
    };  
    
    
    // 2. Verifica email e telefone duplicado
    const existenteEmailUtilizador = await prisma.utilizador.findUnique({
        where: { email: data.email },
    });
    const existenteEmailAdministrador = await prisma.administrador.findUnique({
        where: { email: data.email },
    });
    if (existenteEmailUtilizador || existenteEmailAdministrador) {
        throw new Error("Email já registado");
    };

    // 3. Verifica telefone duplicado
    const telefone = data.telefone?.trim();
    if (!telefone) {
        throw new Error("O telefone não pode estar vazio");
    };
    const existenteTelefone = await prisma.utilizador.findUnique({
        where: { telefone: data.telefone },
    });
    if (existenteTelefone) {
        throw new Error("Telefone já registado");
    };  

    // 4. Hash da password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 5. Regista o utilizador
    const novoUtilizador = await prisma.utilizador.create({
        data: {
            username: data.username,
            nome: data.nome,
            email: data.email,
            telefone,
            password_hash: hashedPassword,
            morada: data.morada,
        },
    });
    return novoUtilizador;
};

// Regista um Administrador
const registerAdministrador= async (data) => {
    
    // 1. Verifica se a passphrase de admin existe
    if (!data.passphrase || data.passphrase !== ADMINISTRADOR_PASSPHRASE) {
        throw new Error("Frase-passe incorreta");
    }

    // 2. Verifica se o nome de utilizador é duplicado
    const nomeAdministrador = await prisma.administrador.findUnique({
        where: { username: data.username },
    });
    const nomeUtilizador = await prisma.utilizador.findUnique({
        where: { username: data.username },
    });

    if (nomeAdministrador || nomeUtilizador) {
        throw new Error("Nome de Utilizador já registado");
    }  


    // 3. Verifica email duplicado
    const existenteEmailAdministrador = await prisma.administrador.findUnique({
        where: { email: data.email },
    });
    const existenteEmailUtilizador = await prisma.utilizador.findUnique({
        where: { email: data.email },
    });

    if (existenteEmailAdministrador || existenteEmailUtilizador) {
        throw new Error("Email já registado");
    }

    // 4. Hash da password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 5. Regista o administrador
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
        throw new Error("Credenciais inválidas");
    }
    const passwordValida = await bcrypt.compare(data.password, utilizador.password_hash);
    if (!passwordValida) {
        throw new Error("Credenciais inválidas");
    }
    
    const token = jwt.sign(
        { id: utilizador.id, email: utilizador.email, role: "Utilizador"},
        JWT_SECRET,
        { expiresIn: "2h" }
    );
    return {token, role: "Utilizador" };
};

// Login do administrador
const loginAdministrador = async (data) => {
    
    const administrador = await prisma.administrador.findUnique({
        where: { email: data.email },
    });
    if (!administrador) {
        throw new Error("Credenciais inválidas");
    }
    const passwordValida = await bcrypt.compare(data.password, administrador.password_hash);
    if (!passwordValida) {
        throw new Error("Credenciais inválidas");
    }

    if (!administrador.ativo) {
        throw new Error("Conta de administrador desativada");
    }

    const token = jwt.sign(
        { id: administrador.id, email: administrador.email, role: "Administrador" },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
    return {token, role: "Administrador" };
};

module.exports = { 
    registerUtilizador, 
    registerAdministrador,
    loginUtilizador,
    loginAdministrador,
};
