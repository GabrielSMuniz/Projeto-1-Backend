const path = require('path');
const express = require('express');
const app = express();

const db = require('./config/database.js');

const autenticacaoRoutes = require('./routes/autenticacaoRoutes.js')
const usuarioRoutes = require('./routes/usuarioRoutes.js');
const conversaRoutes = require('./routes/conversaRoutes.js');
const mensagemRoutes = require('./routes/mensagemRoutes.js');
const { carregarUsuario } = require('./middlewares/Autenticacao.js');

const sessao = require('./config/Sessao.js');

app.use(sessao);

db()

app.use(carregarUsuario);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public'), { index: false }));


app.use(autenticacaoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/conversas', conversaRoutes);
app.use('/api/mensagens', mensagemRoutes);

module.exports = app;