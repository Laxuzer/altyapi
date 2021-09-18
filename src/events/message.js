const { Message } = require('discord.js');
const Ctx = require('../classes/Ctx');
const Event = require('../classes/Event')

module.exports = class MessageEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'messageCreate',
            enabled: true
        })
    }
    /**
     * @param {Message} message 
     */
    run(message) {
        const { prefix } = this.client.config;
        const UPrefix = prefix.find(p => message.content.startsWith(p)) || null;
        if (!UPrefix) return;
    
        let command, cmd, args, passed = [];
        if (message.content.slice(UPrefix.length).startsWith(' ')) {
            command = message.content.split(' ')[1];
            args = message.content.split(' ').slice(2);
        } else {
            command = message.content.split(' ')[0].slice(UPrefix.length);
            args = message.content.split(' ').slice(1);
        };
    
        if (this.client.CommandHandler.commands.has(command)) {
            cmd = this.client.CommandHandler.commands.get(command);
        } else if (this.client.CommandHandler.aliases.has(command)) {
            cmd = this.client.CommandHandler.commands.get(this.client.CommandHandler.aliases.get(command));
        } else return;
    
        if (cmd.permission) {
            if (cmd.permission.bot) {
                if (cmd.permission.bot.channel) {
                    if (!cmd.permission.bot.channel.some(a => message.channel.permissionFor(message.guild.me).hasPermission(a))) {
                        passed.push('botChannel');
                    };
                };
                if (cmd.permission.bot.guild) {
                    if (!cmd.permission.bot.channel.some(a => message.guild.me.hasPermission(a))) {
                        passed.push('botGuild');
                    };
                };
            };
    
            if (cmd.permission.user) {
                if (cmd.permission.user.guild) {
                    if (!cmd.permission.user.guild.some(a => message.member.hasPermission(a))) {
                        passed.push('mGuild');
                    };
                };
    
                if (cmd.permission.user.channel) {
                    if (!cmd.permission.user.channel.some(a => message.channel.permissionFor(message.member).hasPermission(a))) {
                        passed.push('mChannel');
                    };
                };
            };
    
            if (cmd.permission.modRole) {
                //
            };
    
            if (cmd.permission.developerOnly) {
                if (!this.client.config.devs.includes(message.author.id)) {
                    passed.push('Dev')
                };
            };
            if (cmd.permission.ownerOnly) {
                if (message.guild.owner.id !== message.author.id) {
                    passed.push('Owner')
                };
            };
            if (passed.length >= 1) {
                //bot veya memberin yetkisi yetmiyor! passed içinde m ile başlayanlar 'member',
                //bot ile başlayanlar 'bot' dur. ona göre sistem yapabilirsiniz.
            } else {
                try {
                    runCmd(this.client);
                } catch (error) {
                    this.client.ErrorHandler.error({ errorCode: 'CmdRunError', error: error.message, params: [cmd.name]})
                }
            };
        } else {
            try {
                runCmd(this.client);
            } catch (error) {
                this.client.ErrorHandler.error({ errorCode: 'CmdRunError', error: error.message, params: [cmd.name]})
            }
        };
        function runCmd(client) {
            let Context = new Ctx(message, UPrefix, client, cmd.name);
            if (cmd.subCommands.length >= 1) {
                let CMD = cmd.subCommands.find(e => e.aliases.includes(`${Context.input.args[0]}`.toLowerCase()) || e.rawName == `${Context.input.args[0]}`.toLowerCase());
                if (CMD) {
                    CMD.run(new Ctx(message, UPrefix, client, cmd.name, true));
                } else {
                    cmd.run(Context);
                }
            } else {
                cmd.run(Context);
            }
        }
    }
}
