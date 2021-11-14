const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const Command = require('./Command');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const ApplicationCommandOptionTypes = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,
    MENTIONABLE: 9,
    NUMBER: 10,
}

class SlashHandler {
    /**@param {import('./Client')} client */
    constructor(client) {
        this.rest = new REST({ version: '9' }).setToken(client.token);
        this.commands = client.CommandHandler.commands;
        this.aliases = client.CommandHandler.aliases;
        this.parsedCommands = new Collection();
        this.loadedGuilds = [];
        this.client = client;
    }

    /**
     * @param {'commands'|'aliases'} key 
     */
    toArray(key = 'commands') {
        if (key == 'aliases')
            return this.aliases.toJSON();
        else
            return this.commands.toJSON();
    };

    /**
     * @param {SlashCommandStringOption} forEachData 
     * @param {SlashCommandBuilder} Slash 
     */
    parseReqArgs(forEachData, Slash) {
        switch(forEachData.type) {
            case ApplicationCommandOptionTypes.STRING:
                return Slash.addStringOption(forEachData);
            case ApplicationCommandOptionTypes.BOOLEAN:
                return Slash.addBooleanOption(forEachData);
            case ApplicationCommandOptionTypes.NUMBER:
                return Slash.addIntegerOption(forEachData);
            case ApplicationCommandOptionTypes.USER:
                return Slash.addUserOption(forEachData);
            case ApplicationCommandOptionTypes.ROLE:
                return Slash.addRoleOption(forEachData);
            case ApplicationCommandOptionTypes.CHANNEL:
                return Slash.addChannelOption(forEachData);
        }
    }

    async init() {
        
        await this.commands.filter(e => e.slash).forEach(
        /**@param {import('./Command')} c*/
        (c) => {
            let sl = new SlashCommandBuilder().setName(c.name).setDescription(c.description);
            if (c?.reqArgs.length >= 1)
                c.reqArgs.forEach(d => this.parseReqArgs(d, sl));

            //SubCommandLoader
            if (c.subCommands.length >= 1) {
                c.subCommands.forEach((sub) => {
                    sl.addSubcommand((option) => {
                        option.setName(sub.rawName).setDescription(sub.description);
                        if (sub?.reqArgs.length >= 1)
                            sub?.reqArgs.forEach(d => this.parseReqArgs(d, option));
                        return option;
                    })
                })
            }
            this.parsedCommands.set(c.name, sl);
            this.client.logger.templates.Log('SlashCommandParser', `${c.name} Yüklendi. 👍`, { TitleColor: 'red'});            

        })

        try {
            this.client.logger.templates.Log('SlashHandler', `Toplam ${this.commands.size} komut, ${this.client.guilds.cache.size} sunucuya yükleniyor.`, { TitleColor: 'yellow'});            
            this.client.guilds.cache.forEach(async (g) => await this.loadGuild(g));
            this.client.logger.templates.Log('SlashHandler', `Toplam ${this.loadedGuilds.length} sunucuya yüklendi (${this.client.guilds.cache.size-this.loadedGuilds.length} atlandı).`, { TitleColor: 'yellow'});            
        } catch (error) {
            console.error(error);
        }
    };

    async loadGuild(g) {
        try {
            return await new REST({ version: '9' }).setToken(this.client.token).put(Routes.applicationGuildCommands(this.client.user.id, g.id), { body: this.parsedCommands.map(e => e) }).then(e => {
                this.loadedGuilds.push(g.id)
                return true;
            }).catch(e => { 
                return false;
            });
        } catch (e) {
            this.client.ErrorHandler.error({
                params: [g.id],
                errorCode: 'SlashLoadError',
                error: e.message
            });
            return false;
        }
    }
}

module.exports = SlashHandler;