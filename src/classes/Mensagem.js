class Mensagem {
  constructor(remetente, conteudo) {
    this.remetente = remetente;
    this.conteudo = conteudo;
    this.dataEnvio = new Date();
  }
}

module.exports = Mensagem;