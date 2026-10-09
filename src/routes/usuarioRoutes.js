const express = require("express");
const usuarioController = require("../controllers/UsuarioController");
const { exigirAutenticacao } = require("../middlewares/Autenticacao");

const router = express.Router();

router.use(exigirAutenticacao);

router.get("/", usuarioController.listar);
router.get("/me", usuarioController.me);
router.get("/:id", usuarioController.buscarPorId);
router.get("/email/", usuarioController.buscarPorEmail);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.remover);

module.exports = router;