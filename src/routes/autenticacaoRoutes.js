const express = require("express");
const fs = require("fs/promises");
const usuarioController = require("../controllers/UsuarioController");
const { exigirAutenticacao } = require("../middlewares/Autenticacao");
const path = require("path");

const router = express.Router();

function escaparHtml(texto) {
  return texto.replace(/[&<>"']/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caractere]);
}

function enviarPaginaComFlash(res, next, arquivo) {
  fs.readFile(path.join(__dirname, '../../public', arquivo), 'utf8')
    .then(html => {
      const erro = res.flash('erro');
      const mensagem = erro
        ? `<p role="alert" class="error-message">${escaparHtml(erro)}</p>`
        : '';

      res.send(html.replace('<!-- flash:erro -->', mensagem));
    })
    .catch(next);
}

router.get('/', exigirAutenticacao, (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/cadastro', (req, res, next) => {
  enviarPaginaComFlash(res, next, 'cadastro.html');
});
router.post('/cadastro', usuarioController.criar);

router.get('/login', (req, res, next) => {
  enviarPaginaComFlash(res, next, 'login.html');
});

router.post('/login', usuarioController.login);

router.post('/logout', exigirAutenticacao, usuarioController.logout);

module.exports = router;
