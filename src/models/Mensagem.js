const mongoose = require('mongoose');

const mensagemSchema = new mongoose.Schema({
    remetente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    conteudo: {
        type: String,
        required: true,
        trim: true
    },
    dataEnvio: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: { createdAt: 'dataEnvio', updatedAt: false }
});

module.exports = mongoose.model('Mensagem', mensagemSchema);
