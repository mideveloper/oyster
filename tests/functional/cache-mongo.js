var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect;

require("../../components")();

chai.use(chaiAsPromised);

describe("Cache -- Mongo", function() {

    var cache = require("../../lib/helpers/cache");
    var Mongocache_Obj;

    before(function() {

        Mongocache_Obj = cache.initialize({
            client: "mongodb"
        });

        console.log("init -- Mongo");

    });

    after(function() {

    });

    it("setAndGetMongoCache", function() {
        return Mongocache_Obj.set("abc", "bcd").then(function() {
            return Mongocache_Obj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            return expect(val).to.equal("bcd");
        });
    });

    it("removeMongoCache", function() {
        return Mongocache_Obj.remove("abc").then(function() {
            return Mongocache_Obj.get("abc").then(function(val) {
                return val;
            });
        }).then(function(val) {
            expect(val).to.not.exist;
        });
    });

    it("getAndGetBatchMongoCache", function() {
        return Mongocache_Obj.set("abc", "bcd").then(function() {
            return Mongocache_Obj.set("efg", "hij").then(function() {
                return Mongocache_Obj.getBatch(["abc", "efg"]).then(function(vals) {
                    return vals;
                });
            });
        }).then(function(vals) {
            return expect(vals).to.eql({ abc: "bcd", efg: "hij"});
        });
    });

    it("removeBatchMongoCache", function() {
        return Mongocache_Obj.removeBatch(["abc", "efg"]).then(function() {
            return Mongocache_Obj.getBatch(["abc", "efg"]).then(function(vals) {
                return vals;
            });
        }).then(function(vals) {
            return expect(vals).to.eql({});
        });
    });


});
