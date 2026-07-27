const inputTarefa = document.getElementById('nameTarefa');
const selectPrioridade = document.getElementById('prioridade');
const inputData = document.getElementById('data');
const inputHora = document.getElementById('hora');
const btnCadastrar = document.getElementById('botaoCadastra');
const btnDesfazer = document.getElementById('botaoDesfaz');
const listaTarefas = document.getElementById('lista-tarefas');

function formatarDataHora(stringDataHora) {
    if (!stringDataHora) return '';
    const [parteData, parteHora] = stringDataHora.split('T'); 
    const [ano, mes, dia] = parteData.split('-'); 
    return `${dia}/${mes}/${ano} às ${parteHora}`; 
}

function atualizarUrgencias() {
    const tarefas = document.querySelectorAll('.card-tarefa:not(.completed)');
    const agora = new Date(); 

    tarefas.forEach(tarefa => {
        const dataString = tarefa.dataset.datetime;
        if (!dataString) return;
        
        const dataDaTarefa = new Date(dataString);
        const diferencaMs = dataDaTarefa - agora;
        const diferencaHoras = diferencaMs / (1000 * 60 * 60);

        tarefa.classList.remove('urgency-safe', 'urgency-warning', 'urgency-critical', 'urgency-overdue', 'is-due-now');

        if (diferencaHoras <= 0) {
            tarefa.classList.add('urgency-overdue', 'is-due-now');
        } else if (diferencaHoras <= 2) {
            tarefa.classList.add('urgency-critical'); 
        } else if (diferencaHoras <= 24) {
            tarefa.classList.add('urgency-warning'); 
        } else {
            tarefa.classList.add('urgency-safe'); 
        }
    });
}

setInterval(atualizarUrgencias, 10000);

btnCadastrar.addEventListener('click', function (event) {
    event.preventDefault();

    if (inputTarefa.value.trim() === '') {
        alert('Por favor, digite o nome da tarefa!');
        return;
    }
    if (selectPrioridade.value === '') {
        alert('Por favor, selecione a prioridade!');
        return;
    }
    if (inputData.value === '' || inputHora.value === '') {
        alert('Por favor, preencha a data e a hora!');
        return;
    }

    const stringDataHora = `${inputData.value}T${inputHora.value}`;
    const dataFormatada = formatarDataHora(stringDataHora);

    const novoCard = document.createElement('div');
    novoCard.classList.add('card-tarefa'); 
    novoCard.dataset.datetime = stringDataHora; 

    novoCard.innerHTML = `
        <div>
            <h3>${inputTarefa.value}</h3>
            <p><strong>Prioridade:</strong> ${selectPrioridade.value}</p>
            <p><strong>Data/Hora:</strong> ${dataFormatada}</p>
            <button class="botao3">Concluir</button>
        </div>
        <span class="alert-badge">TEMPO ESGOTADO!</span>
    `;

    listaTarefas.appendChild(novoCard);

    const botaoConcluir = novoCard.querySelector('.botao3');
    
    botaoConcluir.addEventListener('click', function () {
        novoCard.classList.add('completed');
        novoCard.style.opacity = '0.6'; 
        atualizarUrgencias(); 
    });

    atualizarUrgencias();

    inputTarefa.value = '';
    selectPrioridade.value = 'Baixa';
    inputData.value = '';
    inputHora.value = '';
});

btnDesfazer.addEventListener('click', function (event) {
    event.preventDefault();
    if (listaTarefas.lastElementChild) {
        listaTarefas.removeChild(listaTarefas.lastElementChild);
    }
});