const session = require('express-session');

const sessao = session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: false,
});

module.exports = sessao;