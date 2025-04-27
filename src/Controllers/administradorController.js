const administradorService = require("../Services/administradorService");

const criarAdministrador = async (req, res) => {
    try {
        const novoRegistro = await administradorService.criarAdministrador(req.body);
        res.status(201).json(novoRegistro);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar administrador" });
    }
};

const listarAdministradores = async (req, res) => {
    try {
        const registros = await administradorService.listarAdministradores();
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar administradores" });
    }
};

const obterPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const registro = await administradorService.obterPorId(id);
        if (!registro) return res.status(404).json({ error: "Administrador não encontrado" });
        res.json(registro);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar administrador" });
    }
};

const atualizarAdministradores = async (req, res) => {
    try {
        const { id } = req.params;
        const atualizado = await administradorService.atualizarAdministradores(id, req.body);
        res.json(atualizado);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar administrador" });
    }
};

const eliminarAdministradores = async (req, res) => {
    try {
        const { id } = req.params;
        await administradorService.eliminarAdministradores(id);
        res.json({ message: "Administrador deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar administrador" });
    }
};

module.exports = {
    criarAdministrador,
    listarAdministradores,
    obterPorId,
    atualizarAdministradores,
    eliminarAdministradores
}