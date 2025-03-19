const consoleElement = document.getElementById('console');
const consoleInput = document.getElementById('console-input');
const botStatusElement = document.getElementById('bot-status');
const cpuUsageElement = document.getElementById('cpu-usage');
const memoryUsageElement = document.getElementById('memory-usage');

// Conectar ao WebSocket
const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
    logToConsole('Conectado ao servidor WebSocket.');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.bots) {
        // Atualizar status dos bots
        botStatusElement.innerHTML = data.bots
            .map(
                (bot) => `
            <div class="bot-status">
                <h2>${bot.name}</h2>
                <p>Status: <span>${bot.status}</span></p>
                <p>Servidores: <span>${bot.guilds}</span></p>
                <p>Usuários: <span>${bot.users}</span></p>
            </div>
        `
            )
            .join('');
    }

    if (data.system) {
        // Atualizar informações do sistema
        cpuUsageElement.textContent = `${(data.system.cpuUsage * 100).toFixed(2)}%`;
        memoryUsageElement.textContent = `${(data.system.memoryUsage * 100).toFixed(2)}%`;
    }

    if (data.response) {
        // Exibir resposta de comandos
        logToConsole(data.response);
    }
};

ws.onerror = (error) => {
    logToConsole(`Erro na conexão WebSocket: ${error}`);
};

ws.onclose = () => {
    logToConsole('Conexão WebSocket fechada.');
};

// Função para exibir mensagens na consola
function logToConsole(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    consoleElement.appendChild(p);
    consoleElement.scrollTop = consoleElement.scrollHeight; // Rolagem automática
}

// Capturar comandos do usuário
consoleInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const command = consoleInput.value.trim();
        if (command) {
            logToConsole(`Comando enviado: ${command}`);
            ws.send(command); // Enviar comando para o servidor
            consoleInput.value = ''; // Limpar campo de entrada
        }
    }
});
