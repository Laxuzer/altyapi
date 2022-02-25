const { Client, Intents } = require("discord.js");

module.exports = class SuperBot extends Client {
    constructor() {
        const CommandHandler = require('./CommandHandler')
        const SlashHandler = require('./SlashHandler')
        const Logger = require('./Logger')
        const Emoji = require('./Emoji')
        const ErrorHandler = require('./ErrorHandler')
        const { JsonDatabase } = require('wio.db');
        const db = new JsonDatabase({ databasePath: './src/database/db.json' });
        global.db = db;
        super({
            intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_MEMBERS'],
            partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
            restTimeOffset: 100,
            messageCacheMaxSize: 100,
        })
        this.CommandHandler = new CommandHandler(this)
        this.SlashHandler = new SlashHandler(this)
        this.ErrorHandler = new ErrorHandler()
        this.logger = new Logger()
        this.Emoji = new Emoji(this)
        this.db = db;
        this.config = require('../config.json');
    }
}
