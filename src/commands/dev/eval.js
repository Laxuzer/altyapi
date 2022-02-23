const Command = require('../../base/Command')
const util = require('util')
const Discord = require('discord.js')

module.exports = class Eval extends Command {
    constructor() {
        super({
            name: 'eval',
            aliases: [],
            category: 'Developer',
            permissions: {
                developerOnly: true
            },
            run: async (ctx) => {
                let z1 = Date.now();
                if (!ctx.client.config.devs.includes(ctx.author.id)) return;
            
                try {
                    let evalOut;
                    if (ctx.input.flags.includes('async')) {
                        evalOut = await eval('(async () => { ' + ctx.input.args.join(' ') + ' })()');
                    } else {
                        evalOut = await eval(ctx.input.args.join(' '));
                    }
                    let evalText;
                    if (ctx.input.flags.includes('full')) {
                        evalText = util.inspect(evalOut).replace(/[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g, '-TOKEN-');
                    } else {
                        evalText = util.inspect(evalOut, { showHiddden: false, depth: 0 }).replace(/[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g, '-TOKEN-');
                    };
                    if (ctx.input.flags.includes('no')) return;
                    let z2 = Date.now();
                    ctx.send({
                        embeds: [{
                            author: { name: `Completed!`, iconURL: ctx.me.user.displayAvatarURL() },
                            description: `\`\`\`js\n${await evalText.slice(0, 2000 - 12).clean(false, '`')}\n\`\`\``,
                            footer: { text: `Completed in ${z2 - z1}ms` }
                        }]
                    });
                } catch (error) {
                    ctx.send({
                        embeds: [{
                            author: { name: `${error.name.up()}!`, iconURL: ctx.me.user.displayAvatarURL() },
                            description: `\`\`\`js\n${await error.message.clean(false, '`')}\n\`\`\``
                        }]
                    });
                };
            }
        })
    }
}
