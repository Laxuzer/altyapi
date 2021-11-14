const { Collection } = require('discord.js');

class Emoji {
    /**@param {import('./Client')} client */
    constructor(client) {
        this.collection = new Collection();
        this.json = {};
        this.array = [];
    }

    get(ename) {
        if (!ename) return 'Emoji girilmedi'
        return this.collection.get(ename);
    }

    init(client) {
        let guilds = []; //Emojilerin alınacağı sunucuyu girin kendi otomatik kaydeder.

        guilds.forEach((p) => {
            client.guilds.cache.get(p).emojis.cache.forEach((e) => {
                this.collection.set(e.name, `${e}`);
                this.json[e.name] = `${e}`;
            });
        });
        this.array = this.collection.toJSON();
    }
}

module.exports = Emoji;