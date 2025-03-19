const { Client, Intents } = require('discord.js');
const os = require('os');

class BotManager {
    constructor() {
        this.bots = new Map(); // Mapa para armazenar os bots
    }

    // Adicionar um novo bot
    addBot(token) {
        const bot = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
        });

        bot.once('ready', () => {
            console.log(`Bot ${bot.user.tag} está online!`);
        });

        bot.login(token);
        this.bots.set(token, bot);
    }

    // Obter status de todos os bots
    getBotsStatus() {
        const status = [];
        for (const [token, bot] of this.bots) {
            status.push({
                name: bot.user?.tag || 'Desconhecido',
                status: bot.user?.presence?.status || 'offline',
                guilds: bot.guilds.cache.size,
                users: bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
            });
        }
        return status;
    }

    // Obter informações de uso de CPU/memória
    getSystemInfo() {
        return {
            cpuUsage: os.loadavg()[0], // Uso da CPU (1 minuto)
            memoryUsage: (os.totalmem() - os.freemem()) / os.totalmem(), // Uso de memória (%)
        };
    }
}

module.exports = BotManager;
