const mongoose = require('mongoose');

const conversaSchema = new mongoose.Schema({
    participantes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }],
    mensagens: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mensagem'
    }]
});

module.exports = mongoose.model('Conversa', conversaSchema);