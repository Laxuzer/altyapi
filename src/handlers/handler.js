const { readdirSync } = require('fs');

module.exports = class MainHandler {
    /**@param {import('../base/Client')} client */
    constructor(client) {
        this.name = 'MAIN_HANDLER';
        this.client = client;
    }

    async init() {
        require('./manual/functionHandler')(this.client);
        const handlers = await readdirSync('./src/handlers/auto');
        this.client.logger.log('Handler', `Loading a total of ${handlers.length} handlers.`, { TitleColor: 'cyan' });
        for (const handler of handlers) {
            const checkCommandLoaded = require.cache[require.resolve(`./auto/${handler}`)];
            if (checkCommandLoaded?.loaded) delete require.cache[require.resolve(`./auto/${handler}`)];
            const Event = require(`./auto/${handler}`);
            const Handler = new Event(this.client);
            if (!Handler.enabled) return;
            Handler.run(this.client);
            this.client.logger.log('Handler', `Loading Handler: ${Handler.name}. 👌`, { TitleColor: 'cyan' });
            delete require.cache[require.resolve(`./auto/${handler}`)];
        }
    }
};
