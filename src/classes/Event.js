const Client = require('./Client');

/***
 * @class Event
 * @type {Event}
 * @public
 */
module.exports = class Event {
    client;
    name;
    enabled = false;

    /**
     * 
     * @param {Client} client 
     * @param {{name: string, enabled?: boolean}} param1 
     */
    constructor(client, { name = null, enabled = true }) {
        if (!client && typeof client !== Client) throw new Error('Client must be defined and of type Discord.Client!');
        this.name = name;
        this.client = client;
        this.enabled = enabled
    }
}