var Promise = global.Packages.Promise,
    _ = global.Packages.lodash;

var _cache = {};

function LocalCache() {

}

LocalCache.prototype.set = function set(key, value, expiry_in_seconds) {

    var self = this;

    return new Promise(function(resolve) {
        expiry_in_seconds = 0; //just to fix lint issue have to add expiration on local cache object
        _cache[key] = value;
        if(expiry_in_seconds && expiry_in_seconds > 0) {
            var expiry = expiry_in_seconds * 1000; //in millisecond
            if(expiry > 2147483647) {
                expiry = 2147483647; //maximum value allowed for setTimeout either wise it will fire immediately
            }
            setTimeout(function() {
                self.remove(key);
            }, expiry);
        }

        resolve();
        return;
    });

};

LocalCache.prototype.get = function get(key) {
    return new Promise(function(resolve) {
        return resolve(_cache[key]);
    });
};

LocalCache.prototype.getBatch = function getBatch(keys) {
    return new Promise(function(resolve) {
        var rtnCache = {};
        _.each(keys, function(key) {
            if(_cache[key]) {
                rtnCache[key] = _cache[key];
            }
        });
        return resolve(rtnCache);
    });
};

LocalCache.prototype.remove = function remove(key) {
    return new Promise(function(resolve) {
        delete _cache[key];
        resolve();
        return;
    });
};

LocalCache.prototype.removeBatch = function removeBatch(keys) {
    return new Promise(function(resolve) {
        _.each(keys, function(key) {
            delete _cache[key];
        });
        return resolve();
    });
};

module.exports = LocalCache;