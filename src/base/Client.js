const { Client, Intents } = require("discord.js");

module.exports = class SuperBot extends Client {
    constructor() {
        const CommandHandler = require('./CommandHandler')
        const Logger = require('./Logger')
        const Events = require('./EventEmitter')
        const Emoji = require('./Emoji')
        const ErrorHandler = require('./ErrorHandler')
        const low = require('lowdb'); 
        const FileSync = require('lowdb/adapters/FileSync');
        const adapter = new FileSync('./src/database/db.json');
        const db = low(adapter);
        global.db = db;
        super({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
            restTimeOffset: 100,
            messageCacheMaxSize: 100,
        })
        this.CommandHandler = new CommandHandler(this)
        this.ErrorHandler = new ErrorHandler()
        this.logger = new Logger()
        this.events = new Events()
        this.Emoji = new Emoji(this)
        this.db = db;
        this.config = require('../config.json');
    }
}