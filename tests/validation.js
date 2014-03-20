// Mocha Validation tests

require("../components/index")();
var chai = require("chai"),
    expect = chai.expect;
var BaseFacade = require("../lib/facade/base");

var UserFacade = BaseFacade.extend();

UserFacade.prototype.validationRules = function validationRules() {
        return [
            {
                "user_id": {
                    required: true,
                    int: true
                }
            },
            {
                "lat": {
                    lat: true
                }
            },
            {
                "lon": {
                    lon: true
                }
            }
        ];
};

UserFacade.prototype.get = function get(input) {

    this.rules = [
        {
            "user_name": {
                length: {
                    args: [2, 4]
                },
                required: true
            }
        },
        {
            "active": {
                required: false,
                boolean: true
            }
        },
        {
            "lat": {
                required: { error_message: "lat custom error message" },
            }
        },
        {
            "lon": {
                lon: true
            }
        },
        {
            "status": {
                custom: {
                    error_message : "Custom error message for field %s",
                    method: function(value) {
                            if(value > 10)
                                return false;
                            return true;
                    },
                }
            }
        }
    ];
    var err = this.validate(input);
    return err;
};

UserFacade.prototype.get2 = function get2(input) {

    this.rules = [];
    var err = this.validate(input);
    return err;
};

var uf = new UserFacade();

describe("Validations", function() {

    beforeEach(function() {
        
    });
    
    describe("should give error messages for", function(){
        
        it("missing global required fields", function(done) {

            var params = {
                "user_name": "test",
                "lat": 90
            };
    
            var output = uf.get(params);
            console.log("validation err: " + output);
            expect(output).to.be.exist;
            done();
        });
    
        it("missing method required fields", function(done) {
    
            var params = {
                "user_id" : 1,
                "user_name": null,
                //"lat": 90
            };
    
            var output = uf.get(params);
            console.log("validation err: " + output);
            expect(output).to.be.exist;
            done();
        });
        
        it("invalid length", function(done) {
    
            var params = {
                "user_id": "2",
                "user_name": "t",
                "lat": 90
            };
    
            var output = uf.get(params);
            console.log("validation err: " + output);
            expect(output).to.be.exist;
            done();
        });
        
        it("invalid lat", function(done) {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 100
            };
    
            var output = uf.get(params);
            console.log("validation err: " + output);
            expect(output).to.be.exist;
            done();
        });
        
        it("invalid lon", function(done) {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90,
                "lon": -360
            };
    
            var output = uf.get(params);
            console.log("validation err: " + output);
            expect(output).to.be.exist;
            done();
        });
        
        it("invalid boolean", function(done) {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90,
                "active" : 1
            };
    
            var output = uf.get(params);
            console.log("validation err: " + output);
            expect(output).to.be.exist;
            done();
        });
        
        it("custom validation", function(done) {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90,
                "active" : 1,
                "status" : 20
            };
    
            var output = uf.get(params);
            console.log("validation err: " + output);
            expect(output).to.be.exist;
            done();
        });
    
    });
    
    describe("should pass", function(){
        
        it("all required field validations", function(done) {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90
            };
    
            var output = uf.get(params);
            console.log("validation err: " + output);
            expect(output).to.not.exist;
            done();
        }); 
        
        it("boolean validation", function(done) {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90,
                "lon" : 90,
                "active": false
            };
    
            var output = uf.get(params);
            console.log("validation err: " + output);
            expect(output).to.not.exist;
            done();
        });
        
        it("custom validation", function(done) {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90,
                "lon" : 90,
                "active": false,
                "status" : 1
            };
    
            var output = uf.get(params);
            console.log("validation err: " + output);
            expect(output).to.not.exist;
            done();
        });
    });
    
    describe("should validate only global rules for", function(){
        
        it("required field validations", function(done) {

            var params = {
                "user_id": "2",
                // "user_name": "test",
                //"lat": 90
            };
    
            var output = uf.get2(params);
            console.log("validation err: " + output);
            expect(output).to.not.exist;
            done();
        }); 
        
    });
    afterEach(function() {

    });
});
