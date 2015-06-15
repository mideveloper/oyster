var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect;

require("../../components")();

chai.use(chaiAsPromised);

describe("Cache -- Redis", function() {

    var cache = require("../../lib/helpers/cache");
    var rediscache_Obj;

    before(function() {

        rediscache_Obj = cache.initialize({
            client: "redis"
        });

        console.log("init -- Redis");

    });

    after(function() {

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
