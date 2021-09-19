class Colors {
    constructor() {
        /**
         * @type {String}
         */
        this.red = "\x1b[31m";
        /**
         * @type {String}
         */
        this.green = "\x1b[32m";
        /**
         * @type {String}
         */
        this.yellow = "\x1b[33m";
        /**
         * @type {String}
         */
        this.cyan = "\x1b[34m";
        /**
         * @type {String}
         */
        this.purple = "\x1b[35m";
        /**
         * @type {String}
         */
        this.blue = "\x1b[36m";
        /**
         * @type {String}
         */
        this.white = "\x1b[37m";
        /**
         * @type {String}
         */
        this.default = "\x1b[0m";
    }
}
class BgColors {
    constructor() {
        /**
         * @type {String}
         */
        this.red = "\x1b[41m";
        /**
         * @type {String}
         */
        this.green = "\x1b[42m";
        /**
         * @type {String}
         */
        this.yellow = "\x1b[43m";
        /**
         * @type {String}
         */
        this.cyan = "\x1b[44m";
        /**
         * @type {String}
         */
        this.purple = "\x1b[45m";
        /**
         * @type {String}
         */
        this.blue = "\x1b[46m";
        /**
         * @type {String}
         */
        this.white = "\x1b[47m";
        /**
         * @type {String}
         */
        this.default = "\x1b[0m";
    };
}

class Templates {
    constructor(Logger) {
        const clr = new Colors();

        /**
         * @param {String} a 
         * @param {String} b
         * @param {Object} options
         * @param {options.TitleColor} [options.TitleColor='purple']
         * @param {options.TextColor} [options.TitleColor='white']
         * @type {Function} 
         */
        this.Log = function(a, b, options = {}) {
            Logger.sendtimelog(Logger.glue(` ${a}: `, clr[options.TitleColor || 'purple']), Logger.glue(b, clr[options.TextColor || 'white']))
        }

        /**
         * @param {String} a 
         * @param {String} b
         * @param {Object} options
         * @param {options.TitleColor} [options.TitleColor='purple']
         * @param {options.TextColor} [options.TitleColor='white']
         * @type {Function} 
         */
        this.ErrorLog = function(a, b, options = {}) {
            Logger.sendtimelog(Logger.glue(` ${a}: `, clr[options.TitleColor || 'purple']), Logger.glue(b, clr[options.TextColor || 'white']))
        }
    }
}

class Logger {
    constructor() {
        const Clr = new Colors();
        const BgClr = new BgColors();
        const Tmp = new Templates(this);

        /**
         * @type {string[]}
         */
        this.logarray = [];

        /**
         * @type {Function}
         * @returns {String}
         */
        this.glue = this.glue;

        /**
         * @type {Function}
         * @returns {String}
         */
        this.send = this.send;

        /**
         * @type {Function}
         * @returns {String}
         */
        this.sendtimelog = this.sendtimelog;

        /**
         * @type {Array<Object>}
         */
        this.logs = this.logs;

        /**
         * @type {Templates}
         */
        this.templates = Tmp;

        /**
         * @type {Colors}
         */
        this.colors = Clr;

        /**
         * @type {BgColors}
         */
        this.bgcolors = BgClr;
    }
    glue() {
        var ar = [];
        for (var i = 0; i < arguments.length; i++) {
            ar.push(arguments[i])
        }
        var txt = ar.shift();
        return ar.join("") + txt + "\x1b[0m"
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