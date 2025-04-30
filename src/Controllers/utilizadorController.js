const utilizadorService = require("../Services/utilizadorService.js");


// Get - Lista todos os utilizadores
async function listarUtilizadores(req, res) {
    try {
        console.log("Listando utilizadores...");  
        const registros = await utilizadorService.listarUtilizadores();
        console.log("Utilizadores encontrados:", registros);  
        res.json(registros);
    } 
        catch (error) {
        console.error("Erro ao buscar utilizadores:", error);  
        res.status(500).json({ error: "Erro ao buscar utilizadores" });
    }
};

// Get - Obtem um Utilizador pelo ID
async function obterPorId(req, res) {
    try {
        const { id } = req.params;
        console.log(`Buscando utilizador com ID: ${id}`);  
        const registro = await utilizadorService.obterPorId(id);
        if (!registro) {
            console.error("Utilizador não encontrado");  
            return res.status(404).json({ error: "Utilizador não encontrado" });
        }
        console.log("Utilizador encontrado:", registro);  
        res.json(registro);
    } 
        catch (error) {
        console.error("Erro ao buscar utilizador:", error);  
        res.status(500).json({ error: "Erro ao buscar utilizador" });
    }
};

// Put - Atualiza os dados de um utilizador
async function atualizarUtilizadores(req, res) {
    try {
        const { id } = req.params;
        console.log(`Atualizando utilizador com ID: ${id}`, req.body);  
        const atualizado = await utilizadorService.atualizarUtilizadores(id, req.body);
        console.log("Utilizador atualizado:", atualizado);  
        res.json(atualizado);
    } 
        catch (error) {
        console.error("Erro ao atualizar utilizador:", error);  
        res.status(500).json({ error: "Erro ao atualizar utilizador" });
    }
};

// Delete - Remove um utilizador 
async function eliminarUtilizadores(req, res) {
    try {
        const { id } = req.params;
        console.log(`Deletando utilizador com ID: ${id}`);  
        await utilizadorService.eliminarUtilizadores(id);
        console.log("Utilizador deletado com sucesso.");  
        res.json({ message: "Utilizador deletado com sucesso" });
    } 
        catch (error) {
        console.error("Erro ao deletar utilizador:", error);  
        res.status(500).json({ error: "Erro ao deletar utilizador" });
    }
};

module.exports = {
    listarUtilizadores,
    obterPorId,
    atualizarUtilizadores,
    eliminarUtilizadores,
};