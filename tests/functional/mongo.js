var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect,
    Promise = require("bluebird");
chai.use(chaiAsPromised);



describe("Mongo", function() {
    global.Packages = {
        "Promise": require("bluebird")
    };
    var mongo = require("../../lib/models/mongo");
    var FunctionalTestModel, mongoBaseModel;

    before(function() {
        mongoBaseModel = mongo.initialize({
            host: "localhost",
            port: "27017",
            db: "functionaltest"
        });
        console.log("init");
        FunctionalTestModel = mongoBaseModel.extend({
            tableName: "test"
        });
    });

    after(function() {
        return new FunctionalTestModel().deleteAll().then(function() {
            return true;
        });
    });


    it("save", function() {
        return new FunctionalTestModel({
            _id: 1,
            name: "ftest1"
        }).save().then(function() {
            expect(true).to.equal(true);
        });

    });

    it("find", function(done) {
    
    
        return Promise.all([
            new FunctionalTestModel({
                _id: 1,
                name: "ftest1",
                search_column: "search me"
            }).save(),
            new FunctionalTestModel({
                _id: 2,
                name: "ftest2",
                search_column: "search me"
            }).save(),
            new FunctionalTestModel({
                _id: 3,
                name: "ftest3",
                search_column: "no search me 2"
            }).save(),
            new FunctionalTestModel({
                _id: 4,
                name: "ftest4",
                search_column: "no search me 2"
            }).save()
        ]).spread(function() {
            new FunctionalTestModel().find({
                "search_column": "search me"
            }).then(function(data) {
                expect(data.length).to.equal(2);
                done();
            });
        });
    
    });
    
    
    it("pagedFind", function() {
    
    
        return new FunctionalTestModel().pagedFind({
            "search_column": "search me"
        }, undefined, 0, 1).then(function(data) {
            expect(data.length).to.equal(1);
    
        });
    
    
    });

    it("update", function() {
        return new FunctionalTestModel().update({
            _id: 1
        }, {
            name: "ftest2"
        }).then(function() {


            return new FunctionalTestModel({
                _id: 1
            }).fetch().then(function(output) {
                expect(output._id).to.equal(1);
                expect(output.name).to.equal("ftest2");

            });
        });
    });

    it("rawUpdate", function() {
        return new FunctionalTestModel().rawUpdate({
            _id: 1
        }, {
            name: "ftest1"
        }).then(function() {


            return new FunctionalTestModel({
                _id: 1
            }).fetch().then(function(output) {
                expect(output._id).to.equal(1);
                expect(output.name).to.equal("ftest1");

            });
        });
    });

    it("fetch", function() {
        return new FunctionalTestModel({
            _id: 1
        }).fetch().then(function(output) {
            expect(output._id).to.equal(1);
            expect(output.name).to.equal("ftest1");

        });

    });

    it("fetch with select clause one parameter", function() {
        return new FunctionalTestModel({
            _id: 1
        }).fetch("_id").then(function(output) {
            expect(output._id).to.equal(1);
            expect(output.name).to.be.undefined;
        });

    });

    it("fetch with select clause multiple parameters", function() {
        return new FunctionalTestModel({
            _id: 1
        }).fetch("_id", "name").then(function(output) {
            expect(output._id).to.equal(1);
            expect(output.name).to.equal("ftest1");
        });

    });

    it("append single item to array", function() {
        return new FunctionalTestModel({
            test_array: "1"
        }).appendArrayItems({
            _id: 1
        }).then(function() {
            return new FunctionalTestModel({
                _id: 1
            }).fetch().then(function(output) {
                return output;
            });

        }).then(function(o) {
            expect(o.test_array[0]).to.equal("1");

        });

    });

    it("append multiple items to array", function() {
        return new FunctionalTestModel({
            test_array: ["2", "3"]
        }).appendArrayItems({
            _id: 1
        }).then(function() {
            return new FunctionalTestModel({
                _id: 1
            }).fetch().then(function(output) {
                return output;
            });

        }).then(function(o) {
            expect(o.test_array[0]).to.equal("1");

        });

    });

    it("append single item to array if not exist (should add)", function() {
        return new FunctionalTestModel({
            test_array: ["4"]
        }).appendArrayItemsIfNotExist({
            _id: 1
        }).then(function() {
            return new FunctionalTestModel({
                _id: 1
            }).fetch().then(function(output) {
                return output;
            });

        }).then(function(o) {
            expect(o.test_array.length).to.equal(4);

        });

    });

    it("append single item to array if not exist (should not add)", function() {
        return new FunctionalTestModel({
            test_array: ["4"]
        }).appendArrayItemsIfNotExist({
            _id: 1
        }).then(function() {
            return new FunctionalTestModel({
                _id: 1
            }).fetch().then(function(output) {
                return output;
            });

        }).then(function(o) {
            expect(o.test_array.length).to.equal(4);

        });

    });

    it("append multiple items to array if not exist (should add)", function() {
        return new FunctionalTestModel({
            test_array: ["5", "6"]
        }).appendArrayItemsIfNotExist({
            _id: 1
        }).then(function() {
            return new FunctionalTestModel({
                _id: 1
            }).fetch().then(function(output) {
                return output;
            });

        }).then(function(o) {
            expect(o.test_array.length).to.equal(6);

        });

    });

    it("append multiple items to array if not exist (should not add)", function() {
        return new FunctionalTestModel({
            test_array: ["5", "6"]
        }).appendArrayItemsIfNotExist({
            _id: 1
        }).then(function() {
            return new FunctionalTestModel({
                _id: 1
            }).fetch().then(function(output) {
                return output;
            });

        }).then(function(o) {
            expect(o.test_array.length).to.equal(6);

        });

    });


    // it("remove items from array", function(){
    //     return new FunctionalTestModel()
    //     .removeArrayItems({array: "1"})
    //     .then(function(){
    //         return new FunctionalTestModel({_id: 1})
    //         .fetch()
    //         .then(function(o) {
    //             console.log(o);
    //             console.log("array length after remove: " + o.array.length);
    //             expect(o.array.length).to.equal(5);
    //         });
    //     })
    //     .done(null, function(err){
    //         console.log(err);
    //         expect(err).to.not.exist;
    //     });
    // });

    // it("delete document based on criteria", function() {

    //     return new FunctionalTestModel({
    //         _id: 2,
    //         name: "ftest2"
    //     })
    //     .save()
    //     .then(function() {
    //         return new FunctionalTestModel().deleteObject({
    //             _id: 2
    //         }).then(function() {
    //             return new FunctionalTestModel().fetch({
    //                 _id: 2
    //             }).then(function(o) {
    //                 expect(o).to.be.null;
    //             });
    //         }).done(null, function(err) {
    //             console.log(err);
    //             expect(err).to.not.exist;
    //         });
    //     });
    // });

});
