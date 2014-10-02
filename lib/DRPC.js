/*
* @Author: dm.yang
* @Date:   2014-10-01 17:51:25
* @Last Modified by:   dm.yang
* @Last Modified time: 2014-10-02 16:27:18
*/

var EventEmitter = require('events').EventEmitter;
var when = require('when');
var thrift = require('./thrift');
// Generated by running `thrift --gen js:node storm.thrift`
var DistributedRPC = require('./thrift-gen-nodejs/DistributedRPC');
var connectCounts = 0;

module.exports = DRPC;

function DRPC(options) {
    if(!(this instanceof DRPC)) return new DRPC(options);

    EventEmitter.call(this);

    if(!options.host) throw new Error('Param `options.host` required.');

    this.host = options.host;
    this.port = options.port || 3772;
    this.timeout = options.timeout || null;
    this.keepAlive = options.keepAlive !== undefined ? options.keepAlive : true;

    var c = options.maxConnectCounts;
    this.maxConnectCounts = c !== undefined && c >= 0 ? c : 10;

    if(this.keepAlive) this.connect();

    return this;
};

DRPC.prototype = Object.create(EventEmitter.prototype);
DRPC.prototype.constructor = DRPC;

DRPC.prototype.connect = function() {
    if(this.connection) return this;

    var self = this;
    var connection;
    var maxCounts = this.maxConnectCounts;

    if(!this.timeout) connection = thrift.createConnection(this.host, this.port);
    else connection = thrift.createConnection(this.host, this.port, this.timeout);

    if(maxCounts > 0) {
        ++connectCounts;
        if(connectCounts > maxCounts) throw new Error('Maximum connect counts limit.');
    }

    connection.on('error', function(err) {
        self.emit('error', err);
    });

    if(self.keepAlive) {
        connection.on('close', function() {
            self.emit('close');
            self.connect();
        });
    }

    this.connection = connection;
    this.client = thrift.createClient(DistributedRPC, connection);

    return this;
};

DRPC.prototype.execute = function(spoutName, emitValue, callback) {
    if( arguments.length <= 2 ||
        typeof arguments[0] !== 'string' ||
        typeof arguments[1] !== 'string'
    ) throw new Error('Param `spoutName[String]` and `emitValue[String]` required.');

    callback = typeof arguments[2] === 'function' ? arguments[2] : null;

    var self = this;
    var deferred;

    if(!callback) deferred = when.defer();

    if(!this.keepAlive) this.connect();

    if(!this.client) throw new Error('DRCP client is not exists.');

    this.client.execute(spoutName, emitValue, function(err, res) {
        if(!callback) {
            if(err) deferred.reject(err);
            else deferred.resolve(res);
        } else {
            callback(err, res);
        }

        if(!self.keepAlive) {
            self.connection.end();
            self.connection = null;
            self.client = null;
        }
    });

    return !callback ? deferred.promise : this;
};