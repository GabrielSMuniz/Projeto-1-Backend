const mongoose = require('mongoose');

const path = require('path');
const express = require('express');
const app = express();

const db = require('./config/database.js');

const usuarioController = require('./controllers/UsuarioController.js');

const usuarioRoutes = require('./routes/usuarioRoutes.js');

db()

const conn = mongoose.connection;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/usuarios', usuarioRoutes);



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.delete(`/conversas/:conversaId/:nomeUsuario`, (req, res) => {
  const nomeUsuario = req.params.nomeUsuario;
  const conversaId = req.params.conversaId;

  (async () => {
    await conn.collection('mensagens'+conversaId).deleteMany({ remetente: nomeUsuario });
    res.status(200).send({ mensagem: "Mensagens apagadas com sucesso" });
  })();
});

app.get('/conversas/:id/mensagens', (req, res) => {

  (async () => {
    const msg = await conn.collection('mensagens'+req.params.id).find();
    const m = await msg.toArray();
    res.json(m);
  })();

})

app.post('/mensagens', (req, res) => {
  const { conversaId, usuarioNome, texto } = req.body;
  conn.collection('mensagens'+conversaId).insertOne({ remetente: usuarioNome, conteudo: texto });
  res.status(201).send({ menssagem: "Mensagem enviada com sucesso" });
});

module.exports = app;