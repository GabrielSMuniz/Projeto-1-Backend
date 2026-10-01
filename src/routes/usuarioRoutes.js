const express = require("express");
const usuarioController = require("../controllers/UsuarioController");

const router = express.Router();

router.post("/", usuarioController.criar);
router.post("/login", usuarioController.login);
router.get("/", usuarioController.listar);
router.get("/:id", usuarioController.buscarPorId);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.remover);

module.exports = router;