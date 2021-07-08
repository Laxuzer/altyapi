const { MessageEmbed, TextChannel } = require('discord.js');
const { readdirSync } = require('fs');

/**@param {import('../../classes/Client')} client */
module.exports = function(client) {
    Date.prototype.today = function() {
        return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
    }
    Date.prototype.timeNow = function() {
        return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
    }

    String.prototype.send = function(data = { embed: false, channel: TextChannel, embeds: MessageEmbed }) {
        if (!data.embed) 
            return data.channel.send(this.toString());
        else
            return data.channel.send({ embeds: [this.toEmbed()].concat(data.embeds) });
    };
    /**@param {import('discord.js').MessageEmbedOptions} [data={}]*/
    String.prototype.toEmbed = function(data = {}) {
        data.description = data.description ? data.description: this;
        return new MessageEmbed(data);
    }
    String.prototype.isID = function() {
        if ((this.length == 18 || this.length == 19) && !isNaN(this))
            return true;
        else
            return false;
    }
    
    Array.prototype.random = function(options = { count: 1 }) {
        return new Promise((r, j) => {
            let out = [];
            if (options.count <= 1) {
                out.push(this[Math.floor(Math.random() * this.length)]);
            } else {
                for (let index = 0; index < options.count; index++) {
                    let res = this[Math.floor(Math.random() * this.length)];
                    this.remove(res);
                    out.push(res);
                };
            };
            setTimeout(() => {
                r(out);
            }, 1000);
        });
    };

    Array.prototype.remove = function(removeItem) {
        return this.filter(e => e !== removeItem);
    };

    String.prototype.replaceAll = function(find, replace) {
        return this.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    };
    String.prototype.clean = async function(tre = false, ch) {
        let out;
        if (tre) out = this.split(' ').filter(e => !e.startsWith('--'));
        if (ch) 
            out = await eval('this.replace(/' + ch + '/g, `\\' + ch + '}`)')
        else
            out = this.replace(/`/g, "\\`").replace(/"/g, `\\"`).replace(/'/g, `\\'`).replace(/\*/g, `\\*`).replace(/_/g, `\\_`).replace(/~/g, `\\~`);
        
        return out;
    };
    String.prototype.up = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);    
    };

    String.prototype.generate = function(options = { abc: true, number: true, length: 10 }) {
        let a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let out = [];
        for (let index = 0; index < options.length; index++) {
            let r = Math.floor(Math.random() * a.length - 1);
            out.push(a.charAt(r));
        };
        return out.join('');
    };

    Array.prototype.shuffle = function() {
        let array = this;
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        };
        return array;
    };
};