# Mensagens Instantaneas

Aplicacao back-end para cadastro de usuarios, conversas e mensagens usando Node.js e o MongoDB Driver.

## Entidades

- `Usuario`: nome e e-mail do participante.
- `Conversa`: participantes e titulo opcional.
- `Mensagem`: conversa, remetente, conteudo e data de envio.

## Requisitos

- Node.js 18 ou superior.
- MongoDB em execucao local ou uma URI de acesso.

## Instalacao e configuracao

```bash
npm install
```

Por padrao, a aplicacao usa `mongodb://127.0.0.1:27017` e o banco `mensagens_app`. Para alterar:

```bash
export MONGODB_URI="mongodb://127.0.0.1:27017"
export MONGODB_DATABASE="mensagens_app"
```

## Execucao

```bash
npm start
```

O servidor inicia em `http://localhost:3000`.

## Rotas CRUD

Todas as rotas usam JSON:

- `GET /health`: verifica se a API esta respondendo.
- `POST /usuarios`, `GET /usuarios`, `GET /usuarios/:id`, `PUT /usuarios/:id`, `DELETE /usuarios/:id`.
- `POST /conversas`, `GET /conversas`, `GET /conversas/:id`, `PUT /conversas/:id`, `DELETE /conversas/:id`.
- `POST /mensagens`, `GET /mensagens`, `GET /mensagens?conversaId=:id`, `GET /mensagens/:id`, `PUT /mensagens/:id`, `DELETE /mensagens/:id`.

Exemplos de insercao:

```bash
curl -X POST http://localhost:3000/usuarios \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Ana","email":"ana@exemplo.com"}'

curl -X POST http://localhost:3000/conversas \
  -H 'Content-Type: application/json' \
  -d '{"participantes":["ID_DA_ANA","ID_DE_OUTRO_USUARIO"],"titulo":"Trabalho"}'

curl -X POST http://localhost:3000/mensagens \
  -H 'Content-Type: application/json' \
  -d '{"conversaId":"ID_DA_CONVERSA","remetenteId":"ID_DA_ANA","conteudo":"Ola!"}'
```

Campos obrigatorios sao validados antes da operacao. Excecoes sao registradas em `logs/errors.log`.

## Integrantes

- Preencher com os nomes da equipe.
