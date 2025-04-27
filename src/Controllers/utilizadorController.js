const utilizadorService = require("../Services/utilizadorService.js");

// Criar Utilizador
const criarUtilizador = async (req, res) => {
    try {
        console.log("Criando utilizador com os dados:", req.body);  // Log dos dados recebidos
        const novoUtilizador = await utilizadorService.criarUtilizador(req.body);
        console.log("Novo utilizador criado:", novoUtilizador);  // Log do utilizador criado
        res.status(201).json(novoUtilizador);
    } catch (error) {
        console.error("Erro ao criar utilizador:", error);  // Log do erro
        res.status(500).json({ error: "Erro ao criar utilizador" });
    }
};

// Listar Utilizadores
const listarUtilizadores = async (req, res) => {
    try {
        console.log("Listando utilizadores...");  // Log para saber quando está a listar
        const registros = await utilizadorService.listarUtilizadores();
        console.log("Utilizadores encontrados:", registros);  // Log dos utilizadores encontrados
        res.json(registros);
    } catch (error) {
        console.error("Erro ao buscar utilizadores:", error);  // Log do erro
        res.status(500).json({ error: "Erro ao buscar utilizadores" });
    }
};

// Obter Utilizador por ID
const obterPorId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Buscando utilizador com ID: ${id}`);  // Log do ID procurado
        const registro = await utilizadorService.obterPorId(id);
        if (!registro) {
            console.error("Utilizador não encontrado");  // Log de erro caso não encontre
            return res.status(404).json({ error: "Utilizador não encontrado" });
        }
        console.log("Utilizador encontrado:", registro);  // Log do utilizador encontrado
        res.json(registro);
    } catch (error) {
        console.error("Erro ao buscar utilizador:", error);  // Log do erro
        res.status(500).json({ error: "Erro ao buscar utilizador" });
    }
};

// Atualizar Utilizador
const atualizarUtilizadores = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Atualizando utilizador com ID: ${id}`, req.body);  // Log dos dados a serem atualizados
        const atualizado = await utilizadorService.atualizarUtilizadores(id, req.body);
        console.log("Utilizador atualizado:", atualizado);  // Log do utilizador atualizado
        res.json(atualizado);
    } catch (error) {
        console.error("Erro ao atualizar utilizador:", error);  // Log do erro
        res.status(500).json({ error: "Erro ao atualizar utilizador" });
    }
};

// Eliminar Utilizador
const eliminarUtilizadores = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Deletando utilizador com ID: ${id}`);  // Log do ID a ser deletado
        await utilizadorService.eliminarUtilizadores(id);
        console.log("Utilizador deletado com sucesso.");  // Log de sucesso
        res.json({ message: "Utilizador deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar utilizador:", error);  // Log do erro
        res.status(500).json({ error: "Erro ao deletar utilizador" });
    }
};

module.exports = {
    criarUtilizador,
    listarUtilizadores,
    obterPorId,
    atualizarUtilizadores,
    eliminarUtilizadores,
};