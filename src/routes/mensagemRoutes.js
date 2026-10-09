const express = require("express");
const mensagemController = require("../controllers/MensagemController");
const { exigirAutenticacao } = require("../middlewares/Autenticacao");

const router = express.Router();

router.use(exigirAutenticacao);

router.get('/', mensagemController.listar);
router.post('/', mensagemController.criar);
router.delete('/:id', mensagemController.deletar);

module.exports = router;
