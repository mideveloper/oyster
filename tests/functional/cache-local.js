var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect;

require("../../components")();

chai.use(chaiAsPromised);

describe("Cache -- Local", function() {

    var cache = require("../../lib/helpers/cache");
    var local_cacheObj;

    before(function() {
        local_cacheObj = cache.initialize({
            client: "local"
        });

        console.log("init -- Local");

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


});
