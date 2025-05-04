const express = require("express");
const router = express.Router();
const sorteioRifasController = require("../Controllers/sorteioRifasController");

const { autenticacao, apenasAdministrador } = require("../Middlewares/authMiddlewares");


// Criar um novo sorteio (apenas administrador)
router.post("/", autenticacao, apenasAdministrador, sorteioRifasController.criarSorteio);

// Lista todos os sorteios (qualquer utilizador)
router.get("/", autenticacao, sorteioRifasController.listarSorteios);

// Atualiza um sorteio existente (apenas administrador)
router.put("/:id", autenticacao, apenasAdministrador, sorteioRifasController.atualizarSorteio);

// Remove um sorteio (apenas administrador)
router.delete("/:id", autenticacao, apenasAdministrador, sorteioRifasController.eliminarSorteio);

// Sortear Vencedor (apenas administrador)
router.post("/:id_sorteio/sortear/vencedor", autenticacao, apenasAdministrador, sorteioRifasController.sortearVencedor);

// Sortear Segundo Lugar (apenas administrador)
router.post("/:id_sorteio/sortear/segundo", autenticacao, apenasAdministrador, sorteioRifasController.sortearSegundoLugar);

// Sortear Terceiro Lugar (apenas administrador)
router.post("/:id_sorteio/sortear/terceiro", autenticacao, apenasAdministrador, sorteioRifasController.sortearTerceiroLugar);

module.exports = router;
