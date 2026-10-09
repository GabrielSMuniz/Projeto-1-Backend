const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const registrarErro = require('../utils/Logger');

function extrairTokenCookie(cookieHeader) {
    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(';');
    const cookie = cookies.find(item => item.trim().startsWith('auth='));

    if (!cookie) {
        return null;
    }

    return cookie.trim().split('=')[1];
}

async function carregarUsuario(req, res, next) {
    req.usuario = null;

    const token = extrairTokenCookie(req.headers.cookie);

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
        req.usuario = await Usuario.findById(decoded.id).select('-senha');
    } catch (error) {
        registrarErro(error, 'Carregar usuário a partir do token');
        req.usuario = null;
    }

    return next();
}

async function exigirAutenticacao(req, res, next) {
    if (!req.usuario) {
        registrarErro(new Error('Usuário não autenticado'), `${req.method} ${req.originalUrl}`);
        return res.redirect('/login');
    }

    return next();
}

module.exports = { exigirAutenticacao, carregarUsuario };
