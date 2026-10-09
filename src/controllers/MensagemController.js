const Mensagem = require('../models/Mensagem.js');
const Conversa = require('../models/Conversa.js');
const registrarErro = require('../utils/Logger');

class MensagemController {
    async criar(req, res) {
        try {
            const { conteudo } = req.body;
            const remetenteId = req.usuario && req.usuario._id ? req.usuario._id : null;

            if (!remetenteId) {
                registrarErro(new Error('Usuário não autenticado'), 'Criar mensagem');
                return res.status(401).json({ erro: 'Usuário não autenticado' });
            }

            if (!conteudo || !String(conteudo).trim()) {
                registrarErro(new Error('Conteúdo é obrigatório'), 'Criar mensagem');
                return res.status(400).json({ erro: 'Conteúdo é obrigatório' });
            }

            const mensagem = await Mensagem.create({
                remetente: remetenteId,
                conteudo: String(conteudo).trim()
            });

            return res.status(201).json({
                mensagem: 'Mensagem criada com sucesso',
                dados: {
                    id: mensagem._id,
                    remetente: mensagem.remetente,
                    conteudo: mensagem.conteudo,
                    dataEnvio: mensagem.dataEnvio
                }
            });
        } catch (error) {
            registrarErro(error, 'Criar mensagem');
            return res.status(500).json({
                erro: 'Erro ao criar mensagem',
                detalhes: error.message
            });
        }
    }

    async listar(req, res) {
        try {
            const { conversaId, conversa } = req.query;
            const filtro = {};
            const conversaEscolhida = conversaId || conversa;

            if (conversaEscolhida) {
                filtro.conversa = conversaEscolhida;
            }

            const mensagens = await Mensagem.find(filtro)
                .populate('remetente', 'nome')
                .sort({ dataEnvio: 1 });

            return res.status(200).json(mensagens);
        } catch (error) {
            registrarErro(error, 'Listar mensagens');
            return res.status(500).json({
                erro: 'Erro ao listar mensagens',
                detalhes: error.message
            });
        }
    }

    async deletar(req, res) {
        try {
            const { id } = req.params;

            const mensagem = await Mensagem.findById(id);

            if (!mensagem) {
                registrarErro(new Error('Mensagem não encontrada'), 'Apagar mensagem');
                return res.status(404).json({ erro: 'Mensagem não encontrada' });
            }

            await mensagem.deleteOne();
            
            return res.status(200).json({ mensagem: 'Mensagem apagada com sucesso' });
        } catch (error) {
            registrarErro(error, 'Apagar mensagem');
            return res.status(500).json({
                erro: 'Erro ao apagar mensagem',
                detalhes: error.message
            });
        }
    }
}

module.exports = new MensagemController();
