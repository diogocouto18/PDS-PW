const administradorService = require("../services/administradorService");

exports.listar = async (req, res) => {
    try {
        const registros = await administradorService.obterTodos();
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar administradores" });
    }
};

exports.obterPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const registro = await administradorService.obterPorId(id);
        if (!registro) return res.status(404).json({ error: "Administrador não encontrado" });
        res.json(registro);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar administrador" });
    }
};

exports.criar = async (req, res) => {
    try {
        const novoRegistro = await administradorService.criar(req.body);
        res.status(201).json(novoRegistro);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar administrador" });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const atualizado = await administradorService.atualizar(id, req.body);
        res.json(atualizado);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar administrador" });
    }
};

exports.deletar = async (req, res) => {
    try {
        const { id } = req.params;
        await administradorService.deletar(id);
        res.json({ message: "Administrador deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar administrador" });
    }
};
