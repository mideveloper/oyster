var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect;

require("../../components")();

chai.use(chaiAsPromised);

describe("Cache", function() {

    var cache = require("../../lib/helpers/cache");
    var local_cacheObj, memcache_Obj, mongodbcache_Obj, rediscache_Obj;

    before(function() {
        local_cacheObj = cache.initialize({
            client: "local"
        });
        memcache_Obj = cache.initialize({
            client: "memcache"
        });

        mongodbcache_Obj = cache.initialize({
            client: "mongodb"
        });

        rediscache_Obj = cache.initialize({
            client: "redis"
        });

        console.log("init -- Cache");

    });

    after(function() {

    });

    it("setAndGetLocalCache", function() {
        return local_cacheObj.set("abc", "bcd").then(function() {
            return local_cacheObj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            return expect(val).to.equal("bcd");
        });
    });

    it("removeLocalCache", function() {
        return local_cacheObj.remove("abc").then(function() {
            return local_cacheObj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            expect(val).to.not.exist;
        });
    });

    it("getAndGetBatchLocalCache", function() {
        return local_cacheObj.set("abc", "bcd").then(function() {
            return local_cacheObj.set("efg", "hij").then(function() {
                return local_cacheObj.getBatch(["abc", "efg"]).then(function(vals) {
                    return vals;
                });
            });
        }).then(function(vals) {
            return expect(vals).to.eql({ abc: "bcd", efg: "hij"});
        });
    });

    it("removeBatchLocalCache", function() {
        return local_cacheObj.removeBatch(["abc", "efg"]).then(function() {
            return local_cacheObj.getBatch(["abc", "efg"]).then(function(vals) {
                return vals;
            });
        }).then(function(vals) {
            return expect(vals).to.eql({});
        });
    });

    it("setAndGetMemCache", function() {
        return memcache_Obj.set("abc", "bcd").then(function() {
            return memcache_Obj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            return expect(val).to.equal("bcd");
        });
    });

    it("removeMemCache", function() {
        return memcache_Obj.remove("abc").then(function() {
            return memcache_Obj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            expect(val).to.not.exist;
        });
    });

    it("getAndGetBatchMemCache", function() {
        return memcache_Obj.set("abc", "bcd").then(function() {
            return memcache_Obj.set("efg", "hij").then(function() {
                return memcache_Obj.getBatch(["abc", "efg"]).then(function(vals) {
                    return vals;
                });
            });
        }).then(function(vals) {
            return expect(vals).to.eql({ abc: "bcd", efg: "hij"});
        });
    });

    it("removeBatchMemCache", function() {
        return memcache_Obj.removeBatch(["abc", "efg"]).then(function() {
            return memcache_Obj.getBatch(["abc", "efg"]).then(function(vals) {
                return vals;
            });
        }).then(function(vals) {
            return expect(vals).to.eql({});
        });
    });


    it("setAndGetRedisCache", function() {
        return rediscache_Obj.set("abc", "bcd").then(function() {
            return rediscache_Obj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            return expect(val).to.equal("bcd");
        });
    });

    it("removeRedisCache", function() {
        return rediscache_Obj.remove("abc").then(function() {
            return rediscache_Obj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            expect(val).to.not.exist;
        });
    });

    it("getAndGetBatchRedisCache", function() {
        return rediscache_Obj.set("abc", "bcd").then(function() {
            return rediscache_Obj.set("efg", "hij").then(function() {
                return rediscache_Obj.getBatch(["abc", "efg"]).then(function(vals) {
                    return vals;
                });
            });
        }).then(function(vals) {
            return expect(vals).to.eql({ abc: "bcd", efg: "hij"});
        });
    });

    it("removeBatchRedisCache", function() {
        return rediscache_Obj.removeBatch(["abc", "efg"]).then(function() {
            return rediscache_Obj.getBatch(["abc", "efg"]).then(function(vals) {
                return vals;
            });
        }).then(function(vals) {
            return expect(vals).to.eql({});
        });
    });

});
