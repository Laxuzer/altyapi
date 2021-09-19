const Client = require('./Client');

/***
 * @class Handler
 * @type {Handler}
 * @public
 */
module.exports = class Handler {
    /** 
     * @param {{client: Client, name: string, enabled?: boolean, run: (client: Client) => Promise<void> | void}} param1 
     */
    constructor({
        client,
        name = null,
        enabled = true,
        run
    }) {
        if (!client && client instanceof Client) throw new Error('Client must be defined and of type Discord.Client!');
        this.name = name;
        this.client = client;
        this.enabled = enabled;
        this.run = run;
    }
}