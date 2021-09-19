const Command = require('../../base/Command')
const util = require('util')

module.exports = class ReloadCommand extends Command {
    constructor() {
        super({
            name: 'reload',
            aliases: ['rl'],
            category: 'Geliştirici',
            description: 'Girilen komutu yeniler. Örnek Komut Yolu: dev/eval.js',
            usage: ['rl <komut|komutyolu|all|bot>'],
            permissions: {
                developerOnly: true
            },
            subCommands: [
                {
                    name: 'all',
                    rawName: 'all',
                    aliases: [],
                    description: 'Bütün komutları yeniden yükler.',
                    usage: ['rl all'],
                    run: async (ctx) => {
                        ctx.client.CommandHandler.init();
                        ctx.send('\`All\` commands are reloaded!')
                    }
                },
                {
                    name: 'bot',
                    rawName: 'bot',
                    aliases: [],
                    description: 'Botu yeniden başlatır.',
                    usage: ['rl bot'],
                    run: async (ctx) => {
                        await ctx.send(`${ctx.emoji('dn')} Reloading Bot...`)
                        process.exit(0);
                    }
                }
            ],
            run: async (ctx) => {
                const input = ctx.input.args.join(' ');
                if (!input) return ctx.send('Komut girmediniz.');
                const cmd = ctx.client.CommandHandler.commands.get(input) || ctx.client.CommandHandler.commands.get(ctx.client.CommandHandler.aliases.get(input));
                if (!cmd && !input.endsWith('.js')) return ctx.send('Hatalı komut adı.');
                if (input.endsWith('.js')) {
                    let res = await ctx.client.CommandHandler.loadCommand('./commands/'+input.split('/')[0], input.split('/')[1])
                    if (typeof res == 'object')
                        return ctx.send('Bir hatayla karşılaştım!\n```md\n# '+res.errorCode+':\n'+res.error+'\n```')
                    return ctx.send(input.split('/')[1].replace('.js', '') + ' komutu yenilendi!');
                } else {
                    await ctx.client.CommandHandler.loadCommand(cmd.location, cmd.fileName)
                    return ctx.send('\`'+cmd.name + '\` adlı komutu yenilendi!');
                }
            }
        })
    }
}