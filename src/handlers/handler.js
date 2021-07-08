/**@param {import('../classes/Client')} client */
module.exports = function(client) {
    require('./commandHandler')(client);
    require('./functionHandler')(client);
    require('./eventHandler')(client);
};