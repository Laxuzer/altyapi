const { Message, Permissions, CommandInteraction } = require('discord.js');
const SlashCtx = require('../base/SlashCtx');
const Event = require('../base/Event')

module.exports = class CommandEvent extends Event {
    constructor(client) {
        super({
            name: 'interactionCreate',
            client: client,
            enabled: true,
            /** @param {CommandInteraction} interaction */
            run: async (interaction) => {
                if (!interaction.isCommand()) return;
                let data = this.client.db.get('guilds').find({ guild: interaction.guild.id }).value();
                let passed = [];
                let command = this.client.CommandHandler.commands.get(interaction.commandName);
                if (!command) return interaction.reply('Komut bulunamadı.')
                if (command.permissions) {
                    if (command.permissions.bot) {
                        if (command.permissions.bot.channel) {
                            if (!command.permissions.bot.channel.some(a => interaction.channel.permissionFor(interaction.guild.me).permissions.has(Permissions.FLAGS[a]))) {
                                passed.push('botChannel');
                            };
                        };
                        if (command.permissions.bot.guild) {
                            if (!command.permissions.bot.channel.some(a => interaction.guild.me.permissions.has(Permissions.FLAGS[a]))) {
                                passed.push('botGuild');
                            };
                        };
                    };
            
                    if (command.permissions.user) {
                        if (command.permissions.user.guild) {
                            if (!command.permissions.user.guild.some(a => interaction.member.permissions.has(Permissions.FLAGS[a]))) {
                                passed.push('mGuild');
                            };
                        };

                        if (command.permissions.user.channel) {
                            if (!command.permissions.user.channel.some(a => interaction.channel.permissionFor(interaction.member).permissions.has(Permissions.FLAGS[a]))) {
                                passed.push('mChannel');
                            };
                        };
                    };
            
                    if (command.permissions.modRole) {
                        if (data?.mod_rol && interaction.member.roles.cache.has(data?.mod_rol)) {
                            return runCmd(this.client);
                        }
                    };
            
                    if (command.permissions.developerOnly) {
                        if (!this.client.config.devs.includes(interaction.user.id)) {
                            passed.push('mDev')
                        };
                    };
                    if (command.permissions.ownerOnly) {
                        if (interaction.guild.ownerId !== interaction.user.id) {
                            passed.push('mOwner')
                        };
                    };
                    if (passed.length >= 1) {
                        if (passed.find(e => e.startsWith('m'))) {
                            interaction.reply({ content: 'Bu komutu kullanabilmek için yetkiniz yetersiz.', ephemeral: true });
                        } else if (passed.find(e => e.startsWith('b'))) {
                            interaction.reply({ content: 'Bu komutu kullanabilmek için botun yetkisi yetersiz.', ephemeral: true });
                        } else if (passed.find(e => e.startsWith('b')) && passed.find(e => e.startsWith('m'))) {
                            interaction.reply({ content: 'Bu komutu kullanabilmek için yetkiniz ve botun yetkisi yetersiz.', ephemeral: true });
                        }
                    } else {
                        try {
                            runCmd(this.client);
                        } catch (error) {
                            this.client.ErrorHandler.error({ errorCode: 'CmdRunError', error: error.message, params: [command.name]})
                        }
                    };
                } else {
                    try {
                        runCmd(this.client);
                    } catch (error) {
                        this.client.ErrorHandler.error({ errorCode: 'CmdRunError', error: error.message, params: [command.name]})
                    }
                };


                function runCmd(client) {
                    try {
                        let Context = new SlashCtx(interaction, client);
                        let SubCmd = command.subCommands.find(e => e.rawName == interaction.options.getSubcommand());
                        if (command.subCommands.length >= 1 && SubCmd) {
                            SubCmd.run(new SlashCtx(interaction, client, true));
                        } else {
                            command.run(Context);
                        }
                    } catch (e) {
                        console.error(e);
                    }

                }
            }
        })
    }
}
