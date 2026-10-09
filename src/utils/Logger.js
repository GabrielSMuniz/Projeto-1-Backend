const fs = require('fs');
const path = require('path');

const diretorioLogs = path.join(__dirname, '../../logs');
const arquivoLog = path.join(diretorioLogs, 'erros.log');

function registrarErro(error, operacao) {
  const dataHora = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });
  const tipo = error?.name || 'Error';
  const mensagem = error?.message || String(error);
  const detalhes = error?.stack ? `\nDETALHES: ${error.stack}` : '';
  const registro = `[${dataHora}]\nERRO: ${operacao}\nTIPO: ${tipo}\nMENSAGEM: ${mensagem}${detalhes}\n\n`;

  try {
    fs.mkdirSync(diretorioLogs, { recursive: true });
    fs.appendFileSync(arquivoLog, registro, 'utf8');
  } catch (erroLog) {
    console.error('Não foi possível gravar o arquivo de log:', erroLog.message);
  }
}

module.exports = registrarErro;