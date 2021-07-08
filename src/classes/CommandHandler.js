const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path')
class CommandHandler {
    
    constructor(client) {
        this.commands = new Collection();
        this.aliases = new Collection();
        this.commandSize = this.commands.size;
        this.client = client;
    }

    /**
     * @param {String} [key='commands'|'aliases'] 
     */
    toArray(key = 'commands') {
        if (key == 'aliases')
            return this.aliases.toJSON();
        else
            return this.commands.toJSON();
    };

    async init() {
        const directories = await readdirSync("./src/commands/");
        this.client.logger.templates.Log('CommandHandler', `Loading a total of ${directories.length} categories.`);
        directories.forEach(async (dir) => {
            const commands = await readdirSync("./src/commands/" + dir + "/");
            commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
                const response = this.loadCommand("./commands/" + dir, cmd);
                if (response) {
                    if (typeof response == 'string')
                        this.client.logger.templates.Log('CommandHandler', response);
                    else
                        this.client.ErrorHandler.error({
                            params: [cmd],
                            errorCode: response.errorCode,
                            error: response.error
                        });
                }
            });
        });
    };

    loadCommand(commandPath, commandName) {
        try {
            const checkCommandLoaded = require.cache[require.resolve(`.${commandPath}${path.sep}${commandName}`)];
            if (checkCommandLoaded?.loaded) delete require.cache[require.resolve(`.${commandPath}${path.sep}${commandName}`)];
            const props = new (require(`.${commandPath}${path.sep}${commandName}`));
            this.client.logger.templates.Log('CommandHandler', `Loading Command: ${props.name}. 👌`, "log");
            props.location = commandPath;
            props.fileName = commandName;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.name, props);
            props.aliases.forEach((alias) => {
                this.aliases.set(alias, props.name);
            });
            return false;
        } catch (e) {
            return {
                errorCode: 'CmdLoadError',
                error: e.message == 'require(...) is not a constructor' ? 'Komut bir class değil.': e.message
            };
        }
    }

    async unloadCommand(commandPath, commandName) {
        let command;
        if (this.client.commands.has(commandName)) {
            command = this.client.commands.get(commandName);
        } else if (this.client.aliases.has(commandName)) {
            command = this.client.commands.get(this.client.aliases.get(commandName));
        }
        if (!command) {
            return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        }
        if (command.shutdown) {
            await command.shutdown(this);
        }
        delete require.cache[require.resolve(`.${commandPath}${path.sep}${commandName}`)];
        return false;
    }
}

module.exports = CommandHandler;