const db_mongoose = require('./config/db_mongoose');
const mongoose = require('mongoose');

const Usuario = require("./classes/Usuario.js");
const Conversa = require("./classes/Conversa.js");

const path = require('path');
const express = require('express');
const app = express();


mongoose.connect(
  db_mongoose.connection
).then(() => {
  console.log('conectado');
}).catch((err) => {
  console.log(err);
});

const conn = mongoose.connection;

// conn.collection('mensagens').insertOne({ remetente: "Gabriel", conteudo: "Olá, tudo bem?" });

// conn.collection('mensagens').drop().then(() => {
//   console.log('Coleção mensagens excluída com sucesso.');
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get("/script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "script.js"));
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
  console.log(usuarioNome, texto);
  conn.collection('mensagens'+conversaId).insertOne({ remetente: usuarioNome, conteudo: texto });
  res.status(201).send({ menssagem: "Mensagem enviada com sucesso" });
});

module.exports = app;