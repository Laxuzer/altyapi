const Discord = require('discord.js');
const SuperBot = require('./src/classes/Client');
const client = new SuperBot();
require('./src/handlers/handler')(client);

client.login(client.config.token)
    .then(() => client.logger.templates.Log('Discord', 'Bot Aktif!'))
    .catch((e) => client.ErrorHandler.error({ errorCode: 'ClientLogin', error: e.message }));