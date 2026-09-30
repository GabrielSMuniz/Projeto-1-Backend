
const app = require('./app.js');

const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});