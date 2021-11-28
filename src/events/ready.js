const Event = require('../base/Event')

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super({
            name: 'ready',
            client: client,
            enabled: true,
            run: async () => {
                const { Emoji, SlashHandler } = this.client;
                Emoji.init(this.client);
                SlashHandler.init(this.client);
            }
        })
    }
}
