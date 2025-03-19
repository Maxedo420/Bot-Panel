const express = require('express');
const WebSocket = require('ws');
const BotManager = require('./botManager');
const app = express();
const port = process.env.PORT || 3000;

// Inicializar o gerenciador de bots
const botManager = new BotManager();
botManager.addBot('MTM0MjYzMTUwNTA4Mzc2NDc2Ng.Gybial.88vPc8xwpPMHsAwmO2TVKsw6_rplBAVXo38gjE'); // Substitua pelo token do seu bot
botManager.addBot('MTM0Mjg1MTE2MTYyNzI5OTkzMg.GUQHE1.aE9PwHz3ghUhhRrlG4CaKPR4R2t1nLDFEp1pZY'); // Adicione mais bots se necessário
botManager.addBot('MTM0NDAyMzE5MDMyOTg4ODc2OA.GdZDlP.bpnxSRBaGPOtdCTOjLKD_zSO4wK6nZniI5cJs8');

// Servir arquivos estáticos
app.use(express.static('public'));

// Iniciar servidor HTTP
const server = app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Configurar WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');

    // Enviar status inicial dos bots e informações do sistema
    const data = {
        bots: botManager.getBotsStatus(),
        system: botManager.getSystemInfo(),
    };
    ws.send(JSON.stringify(data));

    // Receber comandos do cliente
    ws.on('message', (message) => {
        console.log(`Comando recebido: ${message}`);
        // Aqui você pode processar o comando e enviar uma resposta
        ws.send(JSON.stringify({ response: `Comando "${message}" executado com sucesso!` }));
    });
});

// API REST para obter informações dos bots e do sistema
app.get('/api/status', (req, res) => {
    const data = {
        bots: botManager.getBotsStatus(),
        system: botManager.getSystemInfo(),
    };
    res.json(data);
});
