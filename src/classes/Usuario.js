class Usuario {
  constructor(nome, email, senha) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
  }

  enviarMensagem(conversa, conteudo) {
    return conversa.adicionarMensagem(this, conteudo);
  }
}

module.exports = Usuario;