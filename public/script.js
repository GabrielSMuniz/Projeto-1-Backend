const stylesheet = document.createElement("link");
stylesheet.rel = "stylesheet";
stylesheet.href = "/styles.css";
document.head.appendChild(stylesheet);

const form = document.getElementById("formMensagem");
const lista = document.getElementById("listaMensagens");

const conversaIdInput = document.getElementById("conversaId");
const textoInput = document.getElementById("texto");
const btnLogout = document.getElementById("btnLogout");
const nomeUsuario = document.getElementById("nomeUsuario");

async function carregarUsuario() {
    const resposta = await fetch("/api/usuarios/me");
    if (!resposta.ok) {
        alert("Erro ao carregar usuário");
        return;
    }
    console.log(resposta);
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
        
        const nomeRemetente = mensagem.remetente ? mensagem.remetente.nome : "Deletado";
        item.textContent = `${nomeRemetente}: ${mensagem.conteudo} - ${new Date(mensagem.dataEnvio).toLocaleString()}`;
        
        lista.appendChild(item);
        const btnApagarMsg = document.createElement("button");
        btnApagarMsg.textContent = "Apagar";
        btnApagarMsg.id = mensagem._id;
        btnApagarMsg.addEventListener("click", async () => {
            const resposta = await fetch(`/api/mensagens/${mensagem._id}`, {
                method: "DELETE"
            });

            if (!resposta.ok) {
                alert("Erro ao apagar mensagem" + (await resposta.json()).detalhes);
                return;
            }

            carregarMensagens();
        });
        lista.appendChild(btnApagarMsg);
    });
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const mensagem = {
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