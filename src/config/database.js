const mongoose = require("mongoose");
const db_mongoose = require('./db_mongoose');
const registrarErro = require('../utils/Logger');

async function connectDatabase() {
  try {
    await mongoose.connect(db_mongoose.connection);

    console.log("MongoDB conectado");
  } catch (error) {
    registrarErro(error, 'Conectar ao MongoDB');
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;