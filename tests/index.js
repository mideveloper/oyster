// Mocha tests should be created

require("../components/index")();
var chai = require("chai"),
    expect = chai.expect;
var BaseFacade = require("../lib/facade/base");

describe("Validation", function() {

    it("returns a number", function() {
        for (var i = 0; i < 10; i++) {
            expect(i).to.be.a("number");
        }
    });

    it("test", function() {
        
        var UserFacade = BaseFacade.extend();
        
        UserFacade.prototype.get = function get(input){
            this.rules = [{ "user_id" : ["required"] }];
            this.validate(input);
        };
        
        var params = { "user_id" : 1 };
        var uf = new UserFacade();
        uf.get(params);
        
    });

});
