/*
* @Author: dm.yang
* @Date:   2014-10-02 15:39:40
* @Last Modified by:   dm.yang
* @Last Modified time: 2014-10-02 16:06:28
*/

var DRCP = require('stormdrcp-node');

var client = DRCP({
    host: '127.0.0.1',
    port: 3772,
    timeout: 1000,
    keepAlive: true,
    maxConnectCounts: 30
});

client.on('error', function(err) {
    throw err;
});

// promise way
client.execute('topology-name', JSON.stringify(data))
    .then(function(res) {
        console.log(res);
    })
    .catch(function(err) {
        throw err;
    });

// callback way
client.execute('topology-name', JSON.stringify(data), function(err, res) {
    if(err) throw err;
    else console.log(res);
});
