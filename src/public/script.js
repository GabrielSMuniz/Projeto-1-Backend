const form = document.getElementById("formMensagem");
const lista = document.getElementById("listaMensagens");

const conversaIdInput = document.getElementById("conversaId");
const usuarioNomeInput = document.getElementById("usuarioNome");
const textoInput = document.getElementById("texto");

async function carregarMensagens() {
    const conversaId = conversaIdInput.value;

    const resposta = await fetch(
        `/conversas/${conversaId}/mensagens`
    );
    
    const mensagens = await resposta.json();

    lista.innerHTML = "";

    mensagens.forEach(mensagem => {
        const item = document.createElement("li");

        item.textContent =
            `${mensagem.remetente}: ${mensagem.conteudo}`;

        lista.appendChild(item);
    });
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const mensagem = {
        conversaId: Number(conversaIdInput.value),
        usuarioNome: usuarioNomeInput.value,
        texto: textoInput.value
    };
    
    const resposta = await fetch("/mensagens", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mensagem)
    });

    if (!resposta.ok) {
        alert("Erro ao enviar mensagem");
        return;
    }

    textoInput.value = "";

    carregarMensagens();
});

conversaIdInput.addEventListener(
    "change",
    carregarMensagens
);

carregarMensagens();