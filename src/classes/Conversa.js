const Mensagem = require("./Mensagem.js");

class Conversa {
  constructor(id, participantes = []) {
    this.id = id;
    this.participantes = participantes;
    this.mensagens = [];
  }

  adicionarMensagem(remetente, conteudo) {
    const mensagem = new Mensagem(remetente, conteudo);
    this.mensagens.push(mensagem);

    return mensagem;
  }

  listarMensagens() {
    return this.mensagens;
  }
}

module.exports = Conversa;