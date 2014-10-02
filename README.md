stormdrpc-node

Apache storm DRPC client for Node.js

### Install

`npm install stormdrpc-node`

### Usage

``` js
var DRPC = require('stormdrpc-node');

var drpcClient = new DRPC(options);
```

**options**

- host: drpc cluster client host

- port: drpc client port, default to 3772

- timeout: TCP connection timeout time, default to null

- keepAlive: keep connect alive, default to true

- maxConnectCounts: the mximum connect counts, if the param `keepAlive` is set true, client will reconnect to storm until the connect counts exceed the maxConnectCounts.

**Events**

- error: emit when exception occurs

- close: emit when connect close while conection is keepAlive

**Methods**

- execute: call storm drpc cluster by thrift protocol

### Example

``` js
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
```
