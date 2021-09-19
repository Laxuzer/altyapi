const Client = require('./Client');

/***
 * @class Event
 * @type {Event}
 * @public
 */
module.exports = class Event {
    /** 
     * @param {{client: Client, name: string, enabled?: boolean, run: (...) => Promise<void> | void}} param1 
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