const Handler = require("../../base/Handler");
const { readdirSync } = require('fs');

module.exports = class CmdHandler extends Handler {
    constructor(client) {
        super({
            name: 'EventHandler',
            client: client,
            enabled: true,
            run: async (client) => {
                const events = await readdirSync('./src/events');
                client.logger.templates.Log('EventHandler', `Loading a total of ${events.length} events.`, { TitleColor: 'green' });
                client.removeAllListeners();
                for (const event of events) {
                    const checkCommandLoaded = require.cache[require.resolve(`../../events/${event}`)];
                    if (checkCommandLoaded?.loaded) delete require.cache[require.resolve(`../../events/${event}`)];
                    const Event = require(`../../events/${event}`);
                    const e = new Event(client);
                    if (!e.enabled) return;
                    client.on(e.name, async (...args) => await e.run(...args));
                    client.logger.templates.Log('EventHandler', `Loading Event: ${e.name}. 👌`, { TitleColor: 'green' });
                    delete require.cache[require.resolve(`../../events/${event}`)];
                }
            }
        })
    }
};