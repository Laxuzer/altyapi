const Colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[34m",
    purple: "\x1b[35m",
    blue: "\x1b[36m",
    white: "\x1b[37m",
    default: "\x1b[0m"
}
const BgColors = {
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    cyan: "\x1b[44m",
    purple: "\x1b[45m",
    blue: "\x1b[46m",
    white: "\x1b[47m",
    default: "\x1b[0m"
}

class Logger {
    constructor() {
        /**
         * @type {string[]}
         */
        this.logarray = [];

        /**
         * @type {Colors}
         */
        this.colors = Colors;

        /**
         * @type {BgColors}
         */
        this.bgcolors = BgColors;
    }
    /**
     * @param {String} a 
     * @param {String} b
     * @param {{TitleColor: "red"|"green"|"yellow"|"cyan"|"purple"|"blue"|"white"|"default", TextColor: "red"|"green"|"yellow"|"cyan"|"purple"|"blue"|"white"|"default"}} options
     * @type {Function} 
     */
    log(a, b, options = {}) {
        this.sendtimelog(this.glue(` ${a}: `, Colors[options.TitleColor || 'purple']), this.glue(b, Colors[options.TextColor || 'white']))
    }
    /**
     * @param {String} a 
     * @param {String} b
     * @param {{TitleColor: "red"|"green"|"yellow"|"cyan"|"purple"|"blue"|"white"|"default", TextColor: "red"|"green"|"yellow"|"cyan"|"purple"|"blue"|"white"|"default"}} options
     * @type {Function} 
     */
    errorLog(a, b, options = {}) {
        this.sendtimelog(this.glue(` ${a}: `, Colors[options.TitleColor || 'purple']), this.glue(b, Colors[options.TextColor || 'white']))
    }
    glue() {
        var ar = [];
        for (var i = 0; i < arguments.length; i++) {
            ar.push(arguments[i])
        }
        var txt = ar.shift();
        return ar.join("") + txt + "\x1b[0m"
    }
    sendtimelog() {
        var s = '',
            d = new Date();
        try {
            for (var i = 0; i < arguments.length; i++) {
                s += arguments[i]
            }
            console.log(`\x1b[36m[${d.today()} ${d.timeNow()}]: \x1b[0m` + s)
            if (this.logarray.length >= 70) {
                this.logarray.shift()
            }
            this.logarray.push(
                JSON.stringify(JSON.parse(`{"time":"${d.today()}-${d.timeNow()}","message":"${s.replace(/\[[0-9]{1,2}m/g,"").replace(/\n/g," ").toString()}"}`))
            );
            return `[${d.today()} ${d.timeNow()}]: ${s}`;
        } catch (e){
            
        }
    }
    /**
     * @param {String} t
     * @param {"red"|"green"|"yellow"|"cyan"|"purple"|"blue"|"white"|"default"} renk
     */
    setRenk(t, renk) {
        return this.glue(t, this.colors[renk]);
    }

    send() {
        var s = '',
            d = new Date();
        try {
            for (var i = 0; i < arguments.length; i++) {
                s += arguments[i]
            }
            console.log(s + this.colors.default);
            if (this.logarray.length >= 70) {
                this.logarray.shift()
            }
            
            this.logarray.push(JSON.parse(`{"time":"${d.today()}-${d.timeNow()}","message":"${s.replace(/\[[0-9]{1,2}m/g,"").replace(/\n/g,"").toString()}"}`))
            return s;
        } catch {}
    }


    logs() {
        return this.logarray
    }
};

Logger.prototype.bgcolors = {
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    cyan: "\x1b[44m",
    purple: "\x1b[45m",
    blue: "\x1b[46m",
    white: "\x1b[47m",
    default: "\x1b[0m"
}
Logger.prototype.colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[34m",
    purple: "\x1b[35m",
    blue: "\x1b[36m",
    white: "\x1b[37m",
    default: "\x1b[0m"
}

module.exports = Logger;