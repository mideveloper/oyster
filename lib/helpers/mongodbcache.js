var Promise = global.Packages.Promise,
    _ = global.Packages.lodash;

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
    return new Mongo_client().find({
        _id: key
    }).then(function(objs) {
        if(objs && objs.length > 0 && objs[0].value) {
            return objs[0].value;
        }
        return null;
    });
}

function getValues(Mongo_client, keys) {
    return new Mongo_client().find({
        _id: {$in: keys}
    }).then(function(objs) {
        var rtcObj = {};
        if (_.size(objs) > 0) {
            _.each(objs, function(obj) {
                rtcObj[obj._id] = obj.value;
            });
        }
        return rtcObj;
    });
}

function removeValue(Mongo_client, key) {
    return new Mongo_client({
        _id: key
    }).deleteObject().then(function() {
            return null;
        });
}


function removeValues(Mongo_client, keys) {
    return new Mongo_client({
        _id: {$in: keys}
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

MongoDBCache.prototype.getBatch = function getBatch(keys) {
    var self = this;
    return getCacheClient(self).then(function(cache) {

        return getValues(cache, keys).then(function(values) {
            return values;
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

MongoDBCache.prototype.removeBatch = function removeBatch(keys) {
    var self = this;
    return getCacheClient(self).then(function(cache) {
        return removeValues(cache, keys).then(function() {
            return;
        });

    });

};

module.exports = MongoDBCache;
