const mongoose = require("mongoose");
const db_mongoose = require('./db_mongoose');

async function connectDatabase() {
  try {
    await mongoose.connect(db_mongoose.connection);

    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;