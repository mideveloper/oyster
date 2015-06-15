var MemCache = require("./memcache"),
    LocalCache = require("./localcache"),
    MongoDbCache = require("./mongodbcache"),
    RedisCache = require("./rediscache");

function initialize(setting) {
    if (setting.client === "memcache") {
        return new MemCache();
    }
    else if(setting.client === "mongodb"){
        return new MongoDbCache();
    }
    else if(setting.client === "redis"){
        return new RedisCache();
    } else {
        return new LocalCache();
    }
}

module.exports = {
    initialize: initialize
};