var Promise = global.Packages.Promise;

var _cache = {};

function LocalCache() {

}

LocalCache.prototype.set = function set(key, value, expiry_in_seconds) {
    return new Promise(function(resolve) {
        _cache[key] = value;
        resolve();
        return;
    });
};

LocalCache.prototype.get = function get(key) {
    return new Promise(function(resolve) {
        return resolve(_cache[key]);
    });
};

LocalCache.prototype.remove = function remove(key) {
    return new Promise(function(resolve) {
        delete _cache[key];
        resolve();
        return;
    });
};

module.exports = LocalCache;