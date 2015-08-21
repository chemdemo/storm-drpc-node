# storm-drpc-node

Apache storm DRPC client for Node.js

Inspired by [node-drpc](https://github.com/rkatti/node-drpc), but the difference is that it can be optionally set keep alive, it does't need to create connection in every `execute()` call, and one can use it in the traditional or promise way as it likes.

### Install

`npm install storm-drpc-node`

### Usage

``` js
var DRPC = require('storm-drpc-node');

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

- connect: emit when connection ready

- timeout: timeout event listener

**Methods**

- execute(String spoutName, String emitValue[, Function callback]): call storm drpc cluster by thrift protocol

---

### Example

``` js
var DRPC = require('storm-drpc-node');

var client = DRPC({
    host: '127.0.0.1',
    port: 3772,
    timeout: 1000,
    keepAlive: true,
    maxConnectCounts: 30
});

client.on('error', function(err) {
    throw err;
});

// Promise way
client.execute('spout-name', JSON.stringify(data))
    .then(function(res) {
        console.log(res);
    })
    .catch(function(err) {
        throw err;
    });

// callback way
client.execute('spout-name', JSON.stringify(data), function(err, res) {
    if(err) throw err;
    else console.log(res);
});
```

---

### Licence

storm-drpc-node is licenced under the MIT licence.
