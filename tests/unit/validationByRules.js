// Mocha Validation tests

require("../../components/index")();
var chai = require("chai"),
    expect = chai.expect;


var Rules = require("../../lib/helpers/rules");
var ValidationHelper = require("../../lib/helpers/validation");

function validationRules() {

    var rules = new Rules();
    rules.addMulti([{
        "user_id": {
            required: true,
            int: true
        }
    }, {
        "lat": {
            lat: true
        }
    }, {
        "lon": {
            lon: true
        }
    }]);
    return rules;

}

function get(input) {

    var new_rules = new Rules(validationRules());
    
    new_rules
        .addCustomSync("test 1 err msg", function test() {
            //console.log("test1");
            return true;
        })
        .addCustomSync("", function test2() {

            return true;
        })
        .addMulti([{
        "user_name": {
            length: {
                args: [2, 4]
            },
            required: true
        }
    }, {
        "active": {
            required: false,
            boolean: true
        }
    }, {
        "lat": {
            required: {
                error_message: "lat custom error message"
            },
        }
    }, {
        "lon": {
            lon: true
        }
    }, {
        "status": {
            custom: {
                error_message: "Custom error message for field %s",
                method: function (value) {
                    if (value > 10) {
                        return false;
                    }
                    return true;
                },
            }
        }
    }]);

    return ValidationHelper.validate(input, new_rules).then(function () {
        console.log("No error");
    });
}

describe("Validations", function() {

    beforeEach(function() {

    });

    describe("should give error messages for", function() {

        it("missing global required fields", function() {

            var params = {
                "user_name": "test",
                "lat": 90
            };

            return get(params).then(function() {
                expect(false).to.be.true;
            }).done(null, function(error) {
                // the expectation threw an error so forward that error to Mocha
                console.log("validation err: " + error);
                expect(error).to.be.exist;
            });

        });

        it("missing method required fields", function() {

            var params = {
                "user_id": 1,
                "user_name": null,
                //"lat": 90
            };

            return get(params).then(function() {
                expect(false).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(error).to.be.exist;
            });
        });

        it("invalid length", function() {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90
            };

            return get(params).then(function() {
                expect(false).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(error).to.be.exist;
            });
        });

        it("invalid lat", function() {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 100
            };

            return get(params).then(function() {
                expect(false).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(error).to.be.exist;
            });
        });

        it("invalid lon", function() {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90,
                "lon": -360
            };

            return get(params).then(function() {
                expect(false).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(error).to.be.exist;
            });
        });

        it("invalid boolean", function() {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90,
                "active": 1
            };

            return get(params).then(function() {
                expect(false).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(error).to.be.exist;
            });
        });

        it("custom validation", function() {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90,
                "active": 1,
                "status": 20
            };

            return get(params).then(function() {
                expect(false).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(error).to.be.exist;
            });
        });

    });

    describe("should pass", function() {

        it("all required field validations", function() {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90
            };

            return get(params).then(function() {
                expect(true).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(false).to.be.true; // to fail test as it should not come in this callback
            });

        });

        it("boolean validation", function() {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90,
                "lon": 90,
                "active": false
            };

            return get(params).then(function() {
                expect(true).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(false).to.be.true; // to fail test as it should not come in this callback
            });
        });

        it("custom validation", function() {

            var params = {
                "user_id": "2",
                "user_name": "test",
                "lat": 90,
                "lon": 90,
                "active": false,
                "status": 1
            };

            return get(params).then(function() {
                expect(true).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(false).to.be.true; // to fail test as it should not come in this callback
            });
        });

    });

   

    afterEach(function() {

    });
});
