var MemCache = require("./memcache"),
    LocalCache = require("./localcache");

function initialize(setting) {
    if (setting.client === "memcache") {
        return new MemCache();
    }
    else {
        return new LocalCache();
    }
}

module.exports = {
    initialize: initialize
};