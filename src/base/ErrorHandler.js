const Logger = new (require('../base/Logger'))();

class ErrorHandler {
    constructor() {
        /**
         * @type {[{ errorCode: String, error?: String, params?: string[]}]}
         */
        this.errors = [];
    };

    /**
     * @param {{ errorCode: String, error?: String|Error, params?: string[]}} options 
     */
    resolveError(options = {}) {
        let data = {
            ClientLogin: 'Lütfen girdiğiniz tokeni kontrol edin.',
            CmdLoadError: `${options.params[0]} adlı komut yüklenemedi lütfen komutu kontrol edin! Alınan hata: ${Logger.glue(options.error, Logger.colors.red)}`,
            CmdRunError: `${options.params[0]} adlı komut yürütülürken bir hatayla karşılaşıldı. Alınan hata: ${Logger.glue(options.error, Logger.colors.red)}`
        };

        return data[options.errorCode];
    };
    /**
     * @param {{ errorCode: String, error?: String, params?: string[]}} options 
     */
    error(options = {}) {
        options = {
            errorCode: options.errorCode || null,
            error: options.error || null,
            params: options.params || []
        }
        let out = this.resolveError(options);
        this.errors.push(options);
        Logger.errorLog(options.errorCode, Logger.glue(out, Logger.colors.yellow), { TitleColor: 'red' });
    };
};

module.exports = ErrorHandler;
