var Promise = global.Packages.Promise,
    Memcached = global.Packages.Memcached,
    _ = global.Packages.lodash;

var _cacheClient, _defaultExpiryInSeconds = 60 * 60;

// var issue = function(details) {
//     global.Logger.error(JSON.stringify(details));

// };

// var failure = function(details) {
//     global.Logger.error(JSON.stringify(details));

// };

// var reconnecting = function(details) {
//     global.Logger.error(JSON.stringify(details));

// };

var getCacheClient = function(ctx) {

    var needstoreload = false;

    if (!_cacheClient) {
        needstoreload = true;
    }

    if (needstoreload) {

        return ctx.getServers().then(function(servers) {

            if (_cacheClient) {
                _cacheClient.end();
            }
            var memcached_servers = [];
            for (var index = 0; index < servers.length; index++) {

                memcached_servers.push(servers[index].server + ":" + servers[index].port);
            }

            _cacheClient = new Memcached(memcached_servers);
            _cacheClient.setMaxListeners(0);
            return _cacheClient;

        });
    }
    else {
        return new Promise(function(resolve) {
            resolve(_cacheClient);
            return;
        });
    }
};

function MemCache() {

}

MemCache.prototype.getServers = function getServers() {
    return new Promise(function(resolve) {
        return resolve([{
            server: "localhost",
            port: 11211
        }]);
    });
};

function setValue(cache_client, key, value, expiry_in_seconds, callback) {
    cache_client.set(key, value, expiry_in_seconds, function(err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
        return;
    });
}

function getValue(cache_client, key, callback) {
    cache_client.get(key, function(err, val) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, val);
        return;
    });
}

function getValues(cache_client, keys, callback) {
    cache_client.getMulti(keys, function(err, vals) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, vals);
        return;
    });
}

function removeValue(cache_client, key, callback) {
    cache_client.del(key, function(err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
        return;
    });
}

function removeAllValues(cache_client, callback) {
    cache_client.flush(function(err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
        return;
    });
}
MemCache.prototype.set = function set(key, value, expiry_in_seconds) {
    var self = this;
    expiry_in_seconds = (expiry_in_seconds && expiry_in_seconds > 0) ? expiry_in_seconds : _defaultExpiryInSeconds;
    return getCacheClient(self).then(function(cache) {

        return Promise.promisify(setValue)(cache, key, value, expiry_in_seconds).then(function() {
            return;
        });

    }).then(function() {
        return;
    });
};

MemCache.prototype.get = function get(key) {
    var self = this;
    return getCacheClient(self).then(function(cache) {

        return Promise.promisify(getValue)(cache, key).then(function(value) {
            if (value === false) {
                return null;
            }
            else {
                return value;
            }
        });

    }).then(function(val) {
        return val;
    });

};

MemCache.prototype.getBatch = function getBatch(keys) {
    var self = this;
    return getCacheClient(self).then(function(cache) {

        return Promise.promisify(getValues)(cache, keys).then(function(values) {
            if (values === false) {
                return null;
            }
            else {
                return values;
            }
        });

    }).then(function(val) {
        return val;
    });

};

MemCache.prototype.remove = function remove(key) {
    var self = this;
    return getCacheClient(self).then(function(cache) {
        return Promise.promisify(removeValue)(cache, key).then(function() {
            return;
        });

    }).then(function() {
        return;
    });

};

MemCache.prototype.removeBatch = function removeBatch(keys) {
    var self = this;
    return getCacheClient(self).then(function(cache) {

        var promise_array = [];

        _.each(keys, function(key) {
            promise_array.push(Promise.promisify(removeValue)(cache, key));
        });

        return Promise.all(promise_array).spread(function() {
            return;
        }).then(function() {
            return;
        });
    }).then(function() {
        return;
    });

};

MemCache.prototype.removeAll = function removeAll() {
    var self = this;
    return getCacheClient(self).then(function(cache) {
        return Promise.promisify(removeAllValues)(cache).then(function() {
            return;
        });
    }).then(function() {
        return;
    });
};

module.exports = MemCache;
