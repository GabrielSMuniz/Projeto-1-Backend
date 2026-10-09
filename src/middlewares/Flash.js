function flash(req, res, next) {
  res.flash = function (tipo, mensagem) {
    if (mensagem === undefined) {
      const mensagemArmazenada = req.session.flash?.[tipo];
      delete req.session.flash?.[tipo];
      return mensagemArmazenada;
    }

    req.session.flash ??= {};
    req.session.flash[tipo] = mensagem;
  };

  next();
}

module.exports = flash;