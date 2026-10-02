const campo = document.getElementById('campo-tarefa');
const botaoAdicionar = document.getElementById('botao-adicionar');
const lista = document.getElementById('lista-tarefas');
const contador = document.getElementById('contador');
const botaoTema = document.getElementById('botao-tema');
const fotoPerfil = document.getElementById('foto-perfil');

const btnTodas = document.getElementById('filtro-todas');
const btnPendentes = document.getElementById('filtro-pendentes');
const btnRealizadas = document.getElementById('filtro-realizadas');

let tarefas = [];
let filtro = 'todas';

const fotoDia = "94b5306c-4cf9-4ab0-995b-0b148e70e644_Original (1).JPG";
const fotoNoite = "6fca7b1b-2470-4f4e-a06e-9ce06b5b8f0b.jpg"; 

function atualizar() {
    lista.innerHTML = '';
    
    let filtradas = tarefas.filter(t => {
        if (filtro === 'pendentes') return !t.realizada;
        if (filtro === 'realizadas') return t.realizada;
        return true;
    });

    filtradas.forEach(t => {
        const li = document.createElement('li');
        if (t.realizada) li.classList.add('realizada');

        li.innerHTML = `
            <span class="texto-tarefa" onclick="alternar(${t.id})">
                <i class="fa-regular ${t.realizada ? 'fa-square-check' : 'fa-square'}"></i> 
                ${t.texto}
            </span>
            <button class="botao-excluir" onclick="excluir(${t.id})"><i class="fa-solid fa-trash"></i></button>
        `;
        lista.appendChild(li);
    });

    const pendentes = tarefas.filter(t => !t.realizada).length;
    contador.textContent = `${pendentes} tarefas pendentes`;
}

function adicionar() {
    if (campo.value.trim() === '') return;
    tarefas.push({ id: Date.now(), texto: campo.value, realizada: false });
    campo.value = '';
    atualizar();
}

function alternar(id) {
    tarefas = tarefas.map(t => t.id === id ? { ...t, realizada: !t.realizada } : t);
    atualizar();
}

function excluir(id) {
    tarefas = tarefas.filter(t => t.id !== id);
    atualizar();
}

// Filtros
[btnTodas, btnPendentes, btnRealizadas].forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filtros button').forEach(b => b.classList.remove('ativo'));
        e.target.classList.add('ativo');
        if (e.target === btnTodas) filtro = 'todas';
        if (e.target === btnPendentes) filtro = 'pendentes';
        if (e.target === btnRealizadas) filtro = 'realizadas';
        atualizar();
    });
});

botaoAdicionar.addEventListener('click', adicionar);
campo.addEventListener('keypress', (e) => { if (e.key === 'Enter') adicionar(); });

botaoTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');
    const icone = botaoTema.querySelector('i');
    
    if (document.body.classList.contains('modo-escuro')) {
        icone.className = 'fa-solid fa-sun';
        fotoPerfil.src = fotoNoite; 
    } else {
        icone.className = 'fa-solid fa-moon';
        fotoPerfil.src = fotoDia; 
    }
});