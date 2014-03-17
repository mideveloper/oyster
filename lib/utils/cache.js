var Promise = global.Packages.Promise;
var _cache = {};

function set(key, value) {
    _cache[key] = value;
}

function get(key) {
    return new Promise(function (resolve) { return resolve(_cache[key]); });
}

function remove(key){
    delete _cache[key];
}

module.exports = {
    set: set,
    get: get,
    remove : remove
};