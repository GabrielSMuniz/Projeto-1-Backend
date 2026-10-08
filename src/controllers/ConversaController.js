const Conversa = require("../models/Conversa.js");
const Mensagem = require("../models/Mensagem.js");
const Usuario = require("../models/Usuario.js");
const { Types } = require('mongoose');

class ConversaController {
  async criar(req, res) {
    try {
      const participantesInformados = Array.isArray(req.body.participantes)
        ? req.body.participantes
        : [req.body.participantes].filter(Boolean);

      const ids = [];

      if (req.usuario && req.usuario._id) {
        ids.push(req.usuario._id.toString());
      }

      for (const participante of participantesInformados) {
        const valor = String(participante).trim();
        if (!valor) continue;

        if (Types.ObjectId.isValid(valor)) {
          ids.push(valor);
          continue;
        }

        const usuario = await Usuario.findOne({ $or: [{ nome: valor }, { email: valor }] }).select('_id');
        if (usuario) {
          ids.push(usuario._id.toString());
        }
      }

      const participantes = [...new Set(ids.map(id => id.toString()))];

      if (participantes.length < 2) {
        return res.status(400).json({ erro: 'É necessário ao menos dois participantes para a conversa.' });
      }

      const conversa = await Conversa.create({ participantes });
      return res.status(201).json(conversa);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao criar conversa',
        detalhes: error.message
      });
    }
  }

  async listar(req, res) {
    try {
      if (!req.usuario) {
        return res.status(401).json({ erro: 'Usuário não autenticado' });
      }

      const conversas = await Conversa.find({ participantes: req.usuario._id })
        .populate('participantes', 'nome email')
        .populate({
          path: 'mensagens',
          populate: { path: 'remetente', select: 'nome' },
          options: { sort: { dataEnvio: -1 } }
        })
        .sort({ updatedAt: -1 });

      return res.status(200).json(conversas);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao listar conversas',
        detalhes: error.message
      });
    }
  }

  async listarMensagens(req, res) {
    try {
      const { id } = req.params;
      const conversa = await Conversa.findById(id);

      if (!conversa) {
        return res.status(404).json({ erro: 'Conversa não encontrada' });
      }

      const mensagens = await Mensagem.find({ conversa: id })
        .populate('remetente', 'nome')
        .sort({ dataEnvio: 1 });

      return res.status(200).json(mensagens);
    } catch (error) {
      return res.status(500).json({
        erro: 'Erro ao listar mensagens',
        detalhes: error.message
      });
    }
  }

  async adicionarMensagem(conversaId, mensagemId) {
    try {
      const conversa = await Conversa.findById(conversaId);
      if (!conversa) {
        throw new Error('Conversa não encontrada');
      }

      conversa.mensagens.push(mensagemId);
      await conversa.save();
    } catch (error) {
      throw new Error('Erro ao adicionar mensagem à conversa: ' + error.message);
    }
  }
}

module.exports = new ConversaController();
