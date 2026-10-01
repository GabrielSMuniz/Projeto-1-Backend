const Usuario = require("../models/Usuario");

class UsuarioController {
  async criar(req, res) {
    console.log(req.body);
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({
          erro: "Nome, email e senha são obrigatórios"
        });
      }

      const usuarioExistente = await Usuario.findOne({ email });

      if (usuarioExistente) {
        return res.status(409).json({
          erro: "Este email já está cadastrado"
        });
      }

      const usuario = await Usuario.create({
        nome,
        email,
        senha
      });

      return res.status(201).json({
        mensagem: "Usuário criado com sucesso",
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          createdAt: usuario.createdAt
        }
      });
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao criar usuário",
        detalhes: error.message
      });
    }
  }

  async listar(req, res) {
    try {
      const usuarios = await Usuario.find().select("-senha");

      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao listar usuários"
      });
    }
  }

  async buscarPorId(req, res) {
    try {
      const usuario = await Usuario.findById(req.params.id).select("-senha");

      if (!usuario) {
        return res.status(404).json({
          erro: "Usuário não encontrado"
        });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({
        erro: "ID inválido"
      });
    }
  }

  async atualizar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      const dadosAtualizados = {
        nome,
        email,
        senha
      };

      const usuario = await Usuario.findByIdAndUpdate(
        req.params.id,
        dadosAtualizados,
        {
          new: true,
          runValidators: true
        }
      ).select("-senha");

      if (!usuario) {
        return res.status(404).json({
          erro: "Usuário não encontrado"
        });
      }

      return res.status(200).json({
        mensagem: "Usuário atualizado com sucesso",
        usuario
      });
    } catch (error) {
      return res.status(400).json({
        erro: "Erro ao atualizar usuário",
        detalhes: error.message
      });
    }
  }

  async remover(req, res) {
    try {
      const usuario = await Usuario.findByIdAndDelete(req.params.id);

      if (!usuario) {
        return res.status(404).json({
          erro: "Usuário não encontrado"
        });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        erro: "ID inválido"
      });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await Usuario
        .findOne({ email })
        .select("+senha");

      if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({
          erro: "Email ou senha inválidos"
        });
      }

      return res.status(200).json({
        mensagem: "Login realizado com sucesso",
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email
        }
      });
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao realizar login"
      });
    }
  }
}

module.exports = new UsuarioController();