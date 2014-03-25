// Mocha Validation tests

require("../../components/index")();
var Promise = global.Packages.Promise;
var chai = require("chai"),
    expect = chai.expect;

var BaseFacade = require("../../lib/facade/base");

function testfunc() {
    return true;
}

var UserFacade = BaseFacade.extend();

UserFacade.prototype.validationRules = function validationRules() {
    return {
        default: [{
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
        }]
    };
};

UserFacade.prototype.get = function get(input) {

    this.rules = {
        custom: {
            sync: [{
                error_message: "test 1 err msg",
                method: function test() {
                    //console.log("test1");
                    return true;
                }
            }, {
                method: function test2() {
                    //console.log("test2 : " + input.user_id + " , " + input.user_name);
                    return true;
                }
            }, {
                method: function() {
                    testfunc(input.user_id);
                },

            }]
        },
        default: [{
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
                    method: function(value) {
                        if (value > 10) {
                            return false;
                        }
                        return true;
                    },
                }
            }
        }]
    };

    return this.validate(input).then(function() {
        console.log("No error");
    });
};

UserFacade.prototype.get2 = function get2(input) {

    this.rules = [];
    return this.validate(input).then(function() {
        console.log("No error");
    });
};

UserFacade.prototype.get3 = function get3(input) {
    this.rules = {
        custom: {
            async: [
                {
                    error_message: "testAsync failed",
                    method: function testAsync() {
                        return new Promise(function(resolve) {
                            console.log("testAsync");
                            if (input.user_id > 5) {
                                resolve(true);
                                return;
                            }
                            else {
                                resolve(false);
                                return;
                            }
                        });
                    }
                }, {
                    error_message: "testAsync2 failed",
                    method: function testAsync2() {
                        return new Promise(function(resolve) {
                            console.log("testAsync2");
                            if (input.user_name) {
                                resolve(true);
                                return;
                            }
                            else {
                                resolve(false);
                                return;
                            }
                        });
                    }
                }
            ]
        }
    };
    
    return this.validate(input).then(function() {
        console.log("No error");
    });
};

var uf = new UserFacade();

describe("Validations", function() {

    beforeEach(function() {

    });

    describe("should give error messages for", function() {

        it("missing global required fields", function() {

            var params = {
                "user_name": "test",
                "lat": 90
            };

            return uf.get(params).then(function() {
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

            return uf.get(params).then(function() {
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

            return uf.get(params).then(function() {
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

            return uf.get(params).then(function() {
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

            return uf.get(params).then(function() {
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

            return uf.get(params).then(function() {
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

            return uf.get(params).then(function() {
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

            return uf.get(params).then(function() {
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

            return uf.get(params).then(function() {
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

            return uf.get(params).then(function() {
                expect(true).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(false).to.be.true; // to fail test as it should not come in this callback
            });
        });

    });

    describe("should validate only global rules for", function() {

        it("required field validations", function() {

            var params = {
                "user_id": "2",
                // "user_name": "test",
                //"lat": 90
            };

            return uf.get2(params).then(function() {
                expect(true).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(false).to.be.true; // to fail test as it should not come in this callback
            });
        });

    });

    describe("should give error message for", function() {

        it("custom async validation failed", function() {

            var params = {
                "user_id": 2,
                "user_name": "test",
                "lat": 90
            };

            return uf.get3(params).then(function() {
                expect(false).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(error).to.be.exist; // to fail test as it should not come in this callback
            });
        });

        it("custom async validations failed", function() {

            var params = {
                "user_id": 1,
                //"user_name": "test",
                "lat": 90
            };

            return uf.get3(params).then(function() {
                expect(false).to.be.true;
            }).done(null, function(error) {
                console.log("validation err: " + error);
                expect(error).to.be.exist; // to fail test as it should not come in this callback
            });
        });

    });

    afterEach(function() {

    });
});
