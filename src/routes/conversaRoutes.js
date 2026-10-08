const express = require("express");
const conversaController = require("../controllers/ConversaController");
const { exigirAutenticacao } = require("../middlewares/Autenticacao");

const router = express.Router();

router.use(exigirAutenticacao);

router.get('/', conversaController.listar);
router.post('/', conversaController.criar);
router.get('/:id/mensagens', conversaController.listarMensagens);

module.exports = router;
