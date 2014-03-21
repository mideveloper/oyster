var _ = require("lodash"),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect;
   
chai.use(chaiAsPromised);



describe("Mongo", function () {
    global.Packages = {
        "Promise": require("bluebird")
    };
    var mongo = require("../../lib/models/mongo");
    var functionalTestModel, mongoBaseModel;

    before(function () {
        mongoBaseModel = mongo.initialize({
            host: "localhost",
            port: "27017",
            db: "functionaltest"
        });
        console.log("init");
        functionalTestModel = mongoBaseModel.extend({
            tableName: "test"
        });
    });

    after(function () {
        return new functionalTestModel().deleteAll().then(function () {
            return true;
        });
    });
    
    it("save", function () {
        return new functionalTestModel({
            _id: 1,
            name : "ftest1"
        }).save().then(function (output) {
            expect(true).to.equal(true);
        });
       
    });

    it("fetch", function () {
        return new functionalTestModel({
            _id: 1
        }).fetch().then(function (output) {
            expect(output._id).to.equal(1);
            expect(output.name).to.equal("ftest1");
            
        });

    });

    it("append single item to array", function () {
        return new functionalTestModel({
            array: "1"
        }).appendArrayItems({ _id: 1 }).then(function (output) {
            return new functionalTestModel({ _id: 1 })
                .fetch()
                .then(function (output) {
                    return output;
                });

        }).then(function (o) {
            expect(o.array[0]).to.equal("1");
            
        });

    });

    it("append multiple items to array", function () {
        return new functionalTestModel({
            array: ["2", "3"]
        }).appendArrayItems({ _id: 1 }).then(function (output) {
            return new functionalTestModel({ _id: 1 })
                .fetch()
                .then(function (output) {
                    return output;
                });

        }).then(function (o) {
            expect(o.array[0]).to.equal("1");

        });

    });

    it("append single item to array if not exist (should add)", function () {
        return new functionalTestModel({
            array: ["4"]
        }).appendArrayItemsIfNotExist({ _id: 1 }).then(function (output) {
            return new functionalTestModel({ _id: 1 })
                .fetch()
                .then(function (output) {
                    return output;
                });

        }).then(function (o) {
            expect(o.array.length).to.equal(4);

        });

    });

    it("append single item to array if not exist (should not add)", function () {
        return new functionalTestModel({
            array: ["4"]
        }).appendArrayItemsIfNotExist({ _id: 1 }).then(function (output) {
            return new functionalTestModel({ _id: 1 })
                .fetch()
                .then(function (output) {
                    return output;
                });

        }).then(function (o) {
            expect(o.array.length).to.equal(4);

        });

    });

    it("append multiple items to array if not exist (should add)", function () {
        return new functionalTestModel({
            array: ["5", "6"]
        }).appendArrayItemsIfNotExist({ _id: 1 }).then(function (output) {
            return new functionalTestModel({ _id: 1 })
                .fetch()
                .then(function (output) {
                    return output;
                });

        }).then(function (o) {
            expect(o.array.length).to.equal(6);

        });

    });
   
    it("append multiple items to array if not exist (should not add)", function () {
        return new functionalTestModel({
            array: ["5", "6"]
        }).appendArrayItemsIfNotExist({ _id: 1 }).then(function (output) {
            return new functionalTestModel({ _id: 1 })
                .fetch()
                .then(function (output) {
                    return output;
                });

        }).then(function (o) {
            expect(o.array.length).to.equal(6);

        });

    });
});
