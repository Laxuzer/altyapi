const Handler = require('../../base/Handler');

module.exports = class CmdHandler extends Handler {
    constructor(client) {
        super({
            name: 'CommandHandler',
            client: client,
            enabled: true,
            run: (client) => {
                const { CommandHandler } = client;
        
                CommandHandler.init();
            }
        })
    }
}