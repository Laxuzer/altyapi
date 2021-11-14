const { Message, TextChannel, CommandInteraction, MessageOptions, User, Guild, GuildMember, MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Client = require('./Client');

class Context {
    /** @param {CommandInteraction} interaction */
    constructor(interaction, client) {
        /**
         * @type {Client}
         * @returns {Client}
         */
        this.client = client;
        this.slash = true;

        /** @type {CommandInteraction}*/
        this.interaction = interaction;

        /**@type {TextChannel}*/
        this.channel = interaction.channel || null;

        /** @type {Guild}*/
        this.guild = interaction.guild || null;

        /** @type {GuildMember}*/
        this.me = this.guild.me || null;

        /** @type {User}*/
        this.author = interaction.user || null;

        /** @type {GuildMember}*/
        this.member = interaction.member || null;
        this.command = this.client.CommandHandler.commands.get(interaction.commandName);
        this.db = this.client.db;
    };

    /** 
     * @param {'string' | 'message' | 'boolean' | 'number' | 'user' | 'member' | 'role' | 'channel'} type 
     * @param {{ name: string, all?: false, getBooleanFromFlags?: false }} opt
     * @description Option.all arguman verilerini Array olarak verir. Ama sadece Message Command üzerinde çalışır.
     */
    find(type, opt) {
        return this.getArgs(type, opt.name);
    }

    emoji(emojiname) {
        return this.client.Emoji.get(emojiname);
    }

    /**
     * @name sendMessage
     * @param  {MessageOptions|MessageEmbed|MessageActionRow|MessageAttachment|MessageButton|String|Number} args 
     * @returns Message
     */
    send(...arg) {
        let Embeds = [], ActionRows = [], Attachments = [], text = '', _Object;
        args.forEach(e => {
            if (typeof e == 'string' || typeof e == 'number') return text += `${e}`;
            if (e instanceof MessageEmbed) return Embeds.push(e);
            if (e instanceof MessageButton) {
                if (ActionRows.length >= 1) {
                    ActionRows[0] = ActionRows[0].addComponents(e);
                } else {
                    let nMAR = new MessageActionRow().addComponents(e)
                    ActionRows.push(nMAR);
                }
                return;
            }
            if (e instanceof MessageActionRow) return ActionRows.push(e);
            if (e instanceof MessageAttachment) return Attachments.push(e);
            if (typeof e == 'object') return _Object = e;
        });
        if (_Object)
            return this.channel.send(_Object);
        else
            return this.channel.send({
                content: text == '' ? undefined: text,
                embeds: Embeds,
                components: ActionRows,
                files: Attachments
            });
    };
    /** @param {'string' | 'message' | 'get' | 'boolean' | 'number' | 'user' | 'member' | 'role' | 'channel' | 'subCommand'} type */
    getArgs(type, name) {
        switch(type) {
            case "string":
                return this.interaction.options.getString(name);
            case "message":
                return this.interaction.options.getMessage(name);
            case "get":
                return this.interaction.options.get(name);
            case "boolean":
                return this.interaction.options.getBoolean(name);
            case "number":
                return this.interaction.options.getNumber(name);
            case "user":
                return this.interaction.options.getUser(name);
            case "member":
                return this.interaction.options.getMember(name);
            case "role":
                return this.interaction.options.getRole(name);
            case "channel":
                return this.interaction.options.getChannel(name);
            case "subCommand":
                return this.interaction.options.getSubcommand();
        }
    }
    /**
     * @name replyMessage
     * @param  {MessageOptions|MessageEmbed|MessageActionRow|MessageAttachment|MessageButton|String|Number} args 
     * @returns Message
     */
    reply(...args) {
        let Embeds = [], ActionRows = [], Attachments = [], text = '', _Object, _Hide = false;
        args.forEach(Value => {
            if (typeof Value == 'string' || typeof Value == 'number') return text += `${Value}`;
            if (Value instanceof MessageEmbed) return Embeds.push(Value);
            if (Value instanceof MessageButton) {
                if (ActionRows.length >= 1) {
                    ActionRows[0] = ActionRows[0].addComponents(Value);
                } else {
                    let nMAR = new MessageActionRow().addComponents(Value)
                    ActionRows.push(nMAR);
                }
                return;
            }
            if (Value instanceof MessageActionRow) return ActionRows.push(Value);
            if (Value instanceof MessageAttachment) return Attachments.push(Value);
            if (Value?.hideReply) return _Hide = true;
            if (typeof Value == 'object') return _Object = Value;
        });
        if (_Object)
            return this.interaction.reply(_Object);
        else
            return this.interaction.reply({
                content: text == '' ? undefined: text,
                embeds: Embeds,
                components: ActionRows,
                files: Attachments,
                allowedMentions: { repliedUser: false },
                ephemeral: _Hide
            });
    };
};

module.exports = Context;
