const { Message, TextChannel, User, Guild, GuildMember, MessageAttachment } = require("discord.js");
const Client = require('./Client');

class Input {
    constructor(message, prefix) {
        let args = message.content.split(' ').slice(1);

        /**
         * @type {String}
         */
        this.prefix = prefix

        /**
         * @type {Array<String>}
         */
        this.flags = message.content.includes('--') ? args.filter(e => e.startsWith('--')).map(e => e.slice(2)): []
        
        /**
         * @type {Array<String>}
         */
        this.args = args.filter(e => !e.startsWith('--'))

        /**
         * @type {Array<String>}
         */
        this.fullArgs = args

        /**
         * @type {String}
         */
        this.content = message.content
        
        /**
         * @type {String}
         */
        this.cleanContent = message.content.clean(true)
    }
}


class Context {
    constructor(message, prefix, client) {
        /**
         * @type {Client}
         * @returns {Client}
         */
        this.client = client;

        /**
         * @type {Message}
         */
        this.message = message;

        /**
         * @type {TextChannel}
         */
        this.channel = message.channel || null;

        /**
         * @type {Guild}
         */
        this.guild = message.guild || null;

        /**
         * @type {GuildMember}
         */
        this.me = message.guild.me || null;

        /**
         * @type {User}
         */
        this.user = message.guild.me.user || null;

        /**
         * @type {User}
         */
        this.author = message.author || null;

        /**
         * @type {GuildMember}
         */
        this.member = message.member || null;

        let In = new Input(message, prefix);
        /**
         * @returns {Input}
         */
        this.input = In;
    };

    /**
     * @name sendMessage
     * @returns {Message}
     */
    send(...args) {
        return this.channel.send(...args);
    };

    /**
     * @name sendAttachment
     * @param {Array<MessageAttachment>} buffer
     * @returns {Message}
     */
    sendAttachment(buffers, message = undefined) {
        return this.channel.send(message, { attachments: buffers });
    };
};

module.exports = Context;