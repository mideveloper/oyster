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

                host: servers[0].host,
                port: servers[0].port,
                db: "cachedb"
            });

            _cacheClient = mongodb_client.extend({
                tableName: "cache"
            });

            _cacheClient.prototype.getDBObject = function getDBObject(object) {

                // prepare mongo specific object from user given object
                return {
                    _id: object.key,
                    value: object.value,
                    modified_on: object.modified_on
                };
            };

            _cacheClient.prototype.getObjectFromDBObject = function getObjectFromDBObject(mongoObject) {
                // return userfriends specific object from mongo object
                mongoObject.key = mongoObject._id;
                delete mongoObject._id;
                return mongoObject;
            };


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
        key: key,
        value: value
    }).save().then(function() {
        return;
    });

}

function getValue(Mongo_client, key) {
    return new Mongo_client({
        key: key
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
        key: key
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
