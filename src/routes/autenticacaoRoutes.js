const express = require("express");
const usuarioController = require("../controllers/UsuarioController");
const { exigirAutenticacao } = require("../middlewares/Autenticacao");
const path = require("path");

const router = express.Router();

router.get('/', exigirAutenticacao, (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/cadastro.html'));
});
router.post('/cadastro', usuarioController.criar);

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/login.html'));
});
router.post('/login', usuarioController.login);

router.post('/logout', exigirAutenticacao, usuarioController.logout);

module.exports = router;
