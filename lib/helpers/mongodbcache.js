var Promise = global.Packages.Promise;

var _cacheClient, _defaultExpiryInSeconds = 60 * 60;

var getCacheClient = function(ctx) {

    var needstoreload = false;

    if (!_cacheClient) {
        needstoreload = true;
    }

    if (needstoreload) {

        return ctx.getServers().then(function(servers) {

            if (_cacheClient) {
                return _cacheClient;
            }

            var mongodb_client = require("../models/mongo").initialize({

                host: servers[0].server,
                port: servers[0].port,
                db: "cachedb"
            });

            _cacheClient = mongodb_client.extend({
                tableName: "cache"
            });

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

function MongoDBCache() {

}

MongoDBCache.prototype.getServers = function getServers() {
    return new Promise(function(resolve) {
        return resolve([{
            server: "localhost",
            port: 27017
        }]);
    });
};

function setValue(Mongo_client, key, value, expiry_in_seconds) {
    // not sure currently that how we handle expiry so currently setting it to zero 
    expiry_in_seconds = 0;
    return new Mongo_client({
        _id: key,
        value: value
    }).save().then(function() {
        return;
    });

}

function getValue(Mongo_client, key) {
    return new Mongo_client({
        _id : key
    }).fetch().then(function(obj) {
        if (obj) {
            return obj.value;
        }
        else {
            return null;
        }
    });
}

function removeValue(Mongo_client, key) {
    return new Mongo_client({
        _id: key
    }).deleteObject().then(function() {
        return;
    });
}

MongoDBCache.prototype.set = function set(key, value, expiry_in_seconds) {
    var self = this;
    expiry_in_seconds = (expiry_in_seconds && expiry_in_seconds > 0) ? expiry_in_seconds : _defaultExpiryInSeconds;
    return getCacheClient(self).then(function(cache) {

        return setValue(cache, key, value, expiry_in_seconds).then(function() {
            return;
        });

    }).then(function() {
        return;
    });
};

MongoDBCache.prototype.get = function get(key) {
    var self = this;
    return getCacheClient(self).then(function(cache) {

        return getValue(cache, key).then(function(value) {
            return value;
        });

    });

};

MongoDBCache.prototype.remove = function remove(key) {
    var self = this;
    return getCacheClient(self).then(function(cache) {
        return removeValue(cache, key).then(function() {
            return;
        });

    });

};

module.exports = MongoDBCache;
