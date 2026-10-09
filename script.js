const STORAGE_KEY = 'senai_minhas_tarefas';

// Carregar as tarefas salvas assim que a página abrir
document.addEventListener('DOMContentLoaded', carregarTarefas);

function carregarTarefas() {
    const tarefas = obterTarefasDoStorage();
    renderizarTarefas(tarefas);
}

function obterTarefasDoStorage() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarTarefasNoStorage(tarefas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

function adicionarTarefa() {
    const input = document.getElementById('taskInput');
    const texto = input.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa válida!");
        return;
    }

    const tarefas = obterTarefasDoStorage();
    
    const novaTarefa = {
        id: Date.now(),
        texto: texto,
        concluida: false
    };

    tarefas.push(novaTarefa);
    salvarTarefasNoStorage(tarefas);

    input.value = "";
    renderizarTarefas(tarefas);
}

function alternarTarefa(id) {
    const tarefas = obterTarefasDoStorage();
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        salvarTarefasNoStorage(tarefas);
        renderizarTarefas(tarefas);
    }
}

function excluirTarefa(id) {
    let tarefas = obterTarefasDoStorage();
    tarefas = tarefas.filter(t => t.id !== id);
    salvarTarefasNoStorage(tarefas);
    renderizarTarefas(tarefas);
}

function renderizarTarefas(tarefas) {
    const lista = document.getElementById('taskList');
    const contador = document.getElementById('taskCounter');
    
    lista.innerHTML = '';

    tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        if (tarefa.concluida) {
            li.classList.add('completed');
        }

        const span = document.createElement('span');
        span.textContent = tarefa.texto;
        span.style.cursor = 'pointer';
        span.onclick = () => alternarTarefa(tarefa.id);

        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'X';
        btnRemover.onclick = () => excluirTarefa(tarefa.id);

        li.appendChild(span);
        li.appendChild(btnRemover);
        lista.appendChild(li);
    });

    const total = tarefas.length;
    contador.textContent = `${total} ${total === 1 ? 'tarefa' : 'tarefas'}`;
}

// Funções do Modal / Banco de Dados
function abrirModal() {
    const modal = document.getElementById('infoModal');
    const jsonBox = document.getElementById('jsonDatabase');
    
    // Mostra o JSON bruto armazenado no localStorage
    const dadosBrutos = localStorage.getItem(STORAGE_KEY) || '[]';
    jsonBox.textContent = JSON.stringify(JSON.parse(dadosBrutos), null, 2);
    
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('infoModal').style.display = 'none';
}

function limparBancoDeDados() {
    if (confirm("Deseja apagar todas as tarefas salvas no banco de dados?")) {
        localStorage.removeItem(STORAGE_KEY);
        carregarTarefas();
        fecharModal();
    }
}

// Fechar modal clicando fora dele
window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target === modal) {
        fecharModal();
    }
}

// Permite adicionar a tarefa apertando a tecla 'Enter'
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        adicionarTarefa();
    }
});
