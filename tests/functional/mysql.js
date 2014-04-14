var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect;

chai.use(chaiAsPromised);
require("../../components/index")();

describe("MySql", function() {


    var mysql = require("../../lib/models/mysql");
    var FunctionalTestModel, mysqlBaseModel;
    var idColumnName = "id",
        nameColumnName = "name";

    before(function() {

        mysqlBaseModel = mysql.initialize({
            host: "localhost",
            port: "3306",
            db: "testMySqlModel",
            uid: "dbuser",
            pwd: "dbuser"
        });
        console.log("init");
        FunctionalTestModel = mysqlBaseModel.extend({
            tableName: "test"
        });
    });

    after(function() {
        return new FunctionalTestModel().deleteAll().then(function() {
            return true;
        });
    });

    it("save", function() {
        var insert_obj = {};
        insert_obj[idColumnName] = 1;
        insert_obj[nameColumnName] = "ftest1";
        return new FunctionalTestModel(insert_obj).save().then(function() {
            expect(true).to.equal(true);
        });

    });

    // it("saveInBatch", function () {
    //     var objs = [];
    //     var insert_obj = {};
    //     insert_obj[idColumnName] = 1;
    //     insert_obj[nameColumnName] = "ftest1";

    //     objs.push(insert_obj);
    //     insert_obj = {};
    //     insert_obj[idColumnName] = 2;
    //     insert_obj[nameColumnName] = "ftest2";
    //     objs.push(insert_obj);

    //     return new FunctionalTestModel(objs).saveInBatch().then(function () {
    //         expect(true).to.equal(true);
    //     });

    // });

    it("fetch", function() {
        var where_clause = {};
        where_clause[idColumnName] = 1;
        return new FunctionalTestModel(where_clause).fetch().then(function(output) {
            // if(output[idColumnName] === 1 && output[nameColumnName] === "ftest1"){
            //     where_clause = {};
            //     where_clause[idColumnName] = 2;
            //     return new FunctionalTestModel(where_clause).fetch().then(function (output) {
            //         return output;
            //     });

            // }
            // else{
            //     expect(true).to.equal(false);
            // }

            expect(output[idColumnName]).to.equal(1);
            expect(output[nameColumnName]).to.equal("ftest1");

        });
        // then(function(output){
        //     expect(output[idColumnName]).to.equal(2);
        //     expect(output[nameColumnName]).to.equal("ftest2");
        // });

    });

    it("fetch with select clause one parameter", function() {
        var where_clause = {};
        where_clause[idColumnName] = 1;
        return new FunctionalTestModel(where_clause).fetch(idColumnName).then(function(output) {
            expect(output[idColumnName]).to.equal(1);
            expect(output[nameColumnName]).to.be.undefined;
        });

    });

    it("fetch with select clause multiple parameters", function() {

        var where_clause = {};
        where_clause[idColumnName] = 1;
        return new FunctionalTestModel(where_clause).fetch(idColumnName, nameColumnName).then(function(output) {
            expect(output[idColumnName]).to.equal(1);
            expect(output[nameColumnName]).to.equal("ftest1");
        });

    });




});
