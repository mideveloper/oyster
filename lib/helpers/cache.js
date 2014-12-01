var MemCache = require("./memcache"),
    LocalCache = require("./localcache"),
    MongoDbCache = require("./mongodbcache");

function initialize(setting) {
    if (setting.client === "memcache") {
        return new MemCache();
    }
    else if(setting.client === "mongodb"){
        return new MongoDbCache();
    }
    else {
        return new LocalCache();
    }
}

module.exports = {
    initialize: initialize
};