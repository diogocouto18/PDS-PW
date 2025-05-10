const administradorService = require("../Services/administradorService");

// Get - Lista todos os administradores existentes
async function listarAdministradores(req, res) {
    try {
        const registros = await administradorService.listarAdministradores();
        return res.json(registros);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar administradores" });
    }
}

// Get - Obtem um administrador existente por um ID
async function obterPorId(req, res) {
    try {
        const { id } = req.params;
        const registro = await administradorService.obterPorId(id);
        if (!registro) {
            return res.status(404).json({ error: "Administrador não encontrado" });
        }
        return res.json(registro);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar administrador" });
    }
}

// Put - Atualiza um administrador existente
async function atualizarAdministradores(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;  // usamos todo o body, e não só `ativo`
        const resultado = await administradorService.atualizarAdministradores(id, data);
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar administrador" });
    }
}

// Delete - Remove um administrador existente
async function eliminarAdministradores(req, res) {
    try {
        const { id } = req.params;
        await administradorService.eliminarAdministradores(id);
        return res.json({ message: "Administrador deletado com sucesso" });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao deletar administrador" });
    }
}

module.exports = {
    listarAdministradores,
    obterPorId,
    atualizarAdministradores,
    eliminarAdministradores
}