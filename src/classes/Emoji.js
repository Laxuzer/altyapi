const { Collection } = require('discord.js');

class Emoji {
    /**@param {import('./Client')} client */
    constructor(client) {
        this.collection = new Collection();
        this.json = {};
        this.array = this.collection.toJSON();
    }

    get(ename) {
        if (!ename) return 'Emoji not entered'
        return this.collection.get(ename);
    }

    init(client) {
        let guilds = []; //Emojilerin alınacağı sunucuyu girin kendi otomatik kaydeder.

        guilds.forEach((p) => {
            client.guilds.cache.get(p).emojis.cache.forEach((e) => {
                this.collection.set(e.name, `${e}`);
            });
        });
        this.array = this.collection.toJSON();
        this.collection.forEach((e, a) => this.json[a] = e);
    }
}

module.exports = Emoji;