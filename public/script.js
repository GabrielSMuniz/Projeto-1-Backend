const stylesheet = document.createElement("link");
stylesheet.rel = "stylesheet";
stylesheet.href = "/styles.css";
document.head.appendChild(stylesheet);

const form = document.getElementById("formMensagem");
const lista = document.getElementById("listaMensagens");

const conversaIdInput = document.getElementById("conversaId");
const usuarioNomeInput = document.getElementById("usuarioNome");
const textoInput = document.getElementById("texto");
const btnApagar = document.getElementById("btnApagar");
const btnLogout = document.getElementById("btnLogout");
const nomeUsuario = document.getElementById("nomeUsuario");

async function carregarUsuario() {
    const resposta = await fetch("/api/usuario/");
    if (!resposta.ok) {
        alert("Erro ao carregar usuário");
        return;
    }

    const usuario = await resposta.json();
    nomeUsuario.textContent = usuario.nome || "Usuário desconhecido";
}

carregarUsuario();

async function carregarMensagens() {

    const resposta = await fetch(
        `/api/mensagens`
    );

    const mensagens = await resposta.json();
    lista.innerHTML = "";

    if (!resposta.ok || !Array.isArray(mensagens)) {
        const item = document.createElement("li");
        item.textContent = mensagens.mensagem || mensagens.erro || "Não foi possível carregar as mensagens.";
        lista.appendChild(item);
        return;
    }

    mensagens.forEach(mensagem => {
        const item = document.createElement("li");
        const btnApagarMsg = document.createElement("button");
        btnApagarMsg.textContent = "Apagar";
        item.appendChild(btnApagarMsg);

        const nomeRemetente = mensagem.remetente ? mensagem.remetente.nome : "Deletado";
        item.textContent = `${nomeRemetente}: ${mensagem.conteudo} - ${new Date(mensagem.dataEnvio).toLocaleString()}`;

        lista.appendChild(item);
    });
}



btnApagar.addEventListener("click", async () => {
    const conversaId = conversaIdInput.value;
    const usuarioNome = usuarioNomeInput.value;

    const resposta = await fetch(`/conversas/${conversaId}/${usuarioNome}/`, {
        method: "DELETE"
    });

    if (!resposta.ok) {
        alert("Erro ao apagar mensagens");
        return;
    }

    carregarMensagens();
});

form.addEventListener("submit", async event => {
    event.preventDefault();

    const mensagem = {
        remetente: usuarioNomeInput.value,
        conteudo: textoInput.value
    };

    const resposta = await fetch("/api/mensagens", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mensagem)
    });

    if (!resposta.ok) {
        alert("Erro ao enviar mensagem" + (await resposta.json()).erro);
        return;
    }

    textoInput.value = "";

    carregarMensagens();
});

btnLogout.addEventListener("click", async () => {
    const resposta = await fetch("/logout", {
        method: "POST"
    });

    if (!resposta.ok) {
        alert("Erro ao fazer logout");
        return;
    }

    window.location.href = "/login";
});

conversaIdInput.addEventListener(
    "change",
    carregarMensagens
);

carregarMensagens();

setInterval(carregarMensagens, 1000);