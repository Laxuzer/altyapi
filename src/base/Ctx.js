const { Message, TextChannel, User, Guild, GuildMember, MessageAttachment, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require("discord.js");
const Client = require('./Client');

class Input {
    /**
     * @param {{ message: Message, prefix: String, subCommand: Boolean }} opt 
     */
    constructor(opt = { message, prefix, subCommand: false }) {
        const { message, prefix, subCommand } = opt;
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
        this.args = subCommand == true ? args.slice(1).filter(e => !e.startsWith('--')): args.filter(e => !e.startsWith('--'))

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
    /**
     * @param {{ message: Message, prefix: String, client: import('./Client'), subCommand: Boolean }} opt
     */
    constructor(opt = { message, prefix, client, subCommand: false }) {
        const { message, prefix, client, subCommand } = opt;
        const input = new Input({ message, prefix, subCommand });

        /**
         * @type {Client}
         * @returns {Client}
         */
        this.client = client;

        /** @type {Message}*/
        this.message = message;

        /** @type {TextChannel}*/
        this.channel = message.channel || null;

        /** @type {Guild}*/
        this.guild = message.guild || null;

        /** @type {GuildMember}*/
        this.me = message.guild.me || null;

        /** @type {User}*/
        this.author = message.author || null;

        /** @type {GuildMember} */
        this.member = message.member || null;

        this.input = input;
        
        this.slash = false;

        this.db = this.client.db;
    };
    /** 
     * @param {'string' | 'message' | 'boolean' | 'number' | 'user' | 'member' | 'role' | 'channel'} type 
     * @param {{ name?: string, all?: false, getBooleanFromFlags?: true }} opt
     * @description Option.all arguman verilerini Array olarak verir. Ama sadece Message Command üzerinde çalışır.
     */
    find(type, opt) {
        let args = this.subCommand ? this.message.content.split(' ').slice(2): this.message.content.split(' ').slice(1);
        switch(type) {
            case "message":
                let o = this.find('number');
                if (args.length == 0) return undefined;
                let m = this.message.channel.messages.fetch(o).catch(e => {});
                return m ? m: undefined;
            case "channel":
                let mention1 = this.message.mentions.channels.map(c => c);
                let name1 = args.map(v => this.guild.channels.cache.find(c => c.name == v)).filter(v => v);
                let id1 = args.map(v => this.guild.channels.cache.get(v));
        
                let all1 = mention1.concat(name1).concat(id1).filter(e => e);
                if (opt?.all)
                    return all;
                else
                    return all1[0];
            case "member":
                let mention2 = this.message.mentions.members.map(e => e);
                let name2 = args.map(v => this.guild.members.cache.find(c => c.user.username == v || c?.displayName == v || c.user.tag == v)).filter(v => v);
                let id2 = args.map(v => this.guild.members.cache.get(v) || undefined);
        
                let all2 = mention2.concat(name2).concat(id2).filter(e => e);
                if (opt?.all)
                    return all2;
                else
                    return all2[0];
            case "user":
                let mention3 = this.message.mentions.users.map(e => e);
                let name3 = args.map(v => this.guild.members.cache.find(c => c.user.username == v || c?.displayName == v || c.user.tag == v)).filter(v => v).map(e => e.user);
                let id3 = args.map(v => this.guild.members.cache.get(v)?.user || undefined);
                let oId3 = args.map(async v => await this.client.users.fetch(v).catch(e => {}))
                let all3 = mention3.concat(name3).concat(id3).concat(oId3).filter(e => e);
                
                if (opt?.all)
                    return all3;
                else
                    return all3[0];
            case "role":
                let mention4 = this.message.mentions.roles.map(c => c);
                let name4 = args.map(v => this.guild.roles.cache.find(c => c.name == v)).filter(v => v);
                let id4 = args.map(v => this.guild.roles.cache.get(v));
        
                let all4 = mention4.concat(name4).concat(id4).filter(e => e);
                if (opt?.all)
                    return all4;
                else
                    return all4[0];
            case "number":
                if (opt.all)
                    return args.filter(e => Boolean(Number(e)))
                else
                    return args.filter(e => Boolean(Number(e)))[0];
            case "string":
                let a1 = args.filter(e => !e.startsWith('--'))
                if (opt.all)
                    return a1;
                else
                    return a1[0];
            case "boolean":
                if (opt?.getBooleanFromFlags || opt?.getBooleanFromFlags == undefined) {
                    if (this.input.flags.includes(opt.name)) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (opt?.getBooleanFromFlags == false) {
                    let c = (this.subCommand ? this.message.content.split(' ').slice(2)[0]: this.message.content.split(' ').slice(1)[0])?.toLowerCase();
                    if (!['evet', 'hayır', 'aç', 'kapat'].includes(c)) return undefined;
                    return ['evet', 'aç'].includes(c) ? true: false;
                }
        }
    }
    
    emoji(emojiname) {
        return this.client.Emoji.get(emojiname);
    }

    /**
     * @name replyMessage
     * @param  {MessageOptions|MessageEmbed|MessageActionRow|MessageAttachment|MessageButton|String|Number} args 
     * @returns Message
     */
    reply(...args) {
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
            if (e instanceof MessageSelectMenu) {
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
            return this.message.reply(_Object);
        else
            return this.message.reply({
                content: text == '' ? undefined: text,
                embeds: Embeds,
                components: ActionRows,
                files: Attachments,
                allowedMentions: { repliedUser: false }
            });
    };
    /**
     * @name sendMessage
     * @param  {MessageOptions|MessageEmbed|MessageActionRow|MessageAttachment|MessageButton|String|Number} args 
     * @returns Message
     */
    send(...args) {
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
            if (e instanceof MessageSelectMenu) {
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
};

module.exports = Context;
