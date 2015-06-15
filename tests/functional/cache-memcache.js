var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect;

require("../../components")();

chai.use(chaiAsPromised);

describe("Cache -- Memcache", function() {

    var cache = require("../../lib/helpers/cache");
    var memcache_Obj;

    before(function() {
        memcache_Obj = cache.initialize({
            client: "memcache"
        });

        console.log("init -- Memcache");

    });

    after(function() {

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



});
