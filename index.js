const Discord = require('discord.js');
const SuperBot = require('./src/base/Client');
const client = new SuperBot();
const Handler = new (require('./src/handlers/handler'))(client);
Handler.init();

client.login(client.config.token)
    .then(() => client.logger.log('Discord', 'Bot Aktif!'))
    .catch((e) => client.ErrorHandler.error({ errorCode: 'ClientLogin', error: e.message }));
