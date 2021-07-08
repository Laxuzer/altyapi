const Event = require('../classes/Event')

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'ready',
            enabled: true
        })
    }

    run() {
        const { Emoji } = this.client;

        Emoji.init(this.client);
    }
}