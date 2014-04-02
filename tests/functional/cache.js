var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect;

require("../../components")();

chai.use(chaiAsPromised);



describe("Cache", function() {

    var cache = require("../../lib/utils/cache");
    var local_cacheObj, memcache_Obj;

    before(function() {
        local_cacheObj = cache.initialize({
            client: "local"
        });
        memcache_Obj = cache.initialize({
            client: "memcache"
        });

        console.log("init");

    });

    after(function() {

    });

    it("setAndGetLocalCache", function() {
        return local_cacheObj.set("abc", "bcd").then(function() {
            return local_cacheObj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            expect(val).to.equal("bcd");
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

    it("setAndGetMemcache", function() {
        return memcache_Obj.set("abc", "bcd").then(function() {
            return memcache_Obj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            expect(val).to.equal("bcd");
        });
    });

    it("removeMemcache", function() {
        return memcache_Obj.remove("abc").then(function() {
            return memcache_Obj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            expect(val).to.not.exist;

        });
    });

});
