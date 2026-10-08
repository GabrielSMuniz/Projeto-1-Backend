const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

class UsuarioController {
  async criar(req, res) {
    try {
      const { nome, email, senha, confirmarSenha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios' });
      }

      if (confirmarSenha && senha !== confirmarSenha) {
        return res.status(400).json({ erro: 'As senhas não coincidem' });
      }

      const usuarioExistente = await Usuario.findOne({ email });

      if (usuarioExistente) {
        return res.status(409).json({ erro: 'Este email já está cadastrado' });
      }

      await Usuario.create({ nome, email, senha });

      return res.redirect('/login');
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao criar usuário',
        detalhes: error.message
      });
    }
  }

  async listar(req, res) {
    try {
      const usuarios = await Usuario.find().select('-senha');
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  }

  async me(req, res) {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Não autenticado' });
    }

    return res.status(200).json(req.usuario);
  }

  async buscarPorId(req, res) {
    try {
      const usuario = await Usuario.findById(req.params.id).select('-senha');

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({ erro: 'ID inválido' });
    }
  }

  async buscarPorEmail(req, res) {
    try {
      const email = req.body.email || req.query.email;
      const usuario = await Usuario.findOne({ email }).select('-senha');

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({ erro: 'Email inválido' });
    }
  }

  async atualizar(req, res) {
    try {
      const { nome, email, senha } = req.body;
      const dadosAtualizados = { nome, email, senha };

      const usuario = await Usuario.findOneAndUpdate(
        { email },
        dadosAtualizados,
        { new: true, runValidators: true }
      ).select('-senha');

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      return res.status(200).json({
        mensagem: 'Usuário atualizado com sucesso',
        usuario
      });
    } catch (error) {
      return res.status(400).json({
        erro: 'Erro ao atualizar usuário',
        detalhes: error.message
      });
    }
  }

  async remover(req, res) {
    try {
      const usuario = await Usuario.findByIdAndDelete(req.params.id);

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ erro: 'ID inválido' });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await Usuario.findOne({ email }).select('+senha');

      if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({ erro: 'Email ou senha inválidos' });
      }

      const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET || 'segredo', {
        expiresIn: '1h'
      });

      req.usuario = usuario;

      res.cookie('auth', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
        path: '/'
      });

      return res.redirect('/');
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao realizar login',
        detalhes: error.message
      });
    }
  }

  async logout(req, res) {
    res.clearCookie('auth', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });

    return res.redirect('/login');
  }
}

module.exports = new UsuarioController();
