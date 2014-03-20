// // Mocha tests should be created

// require("../components/index")();
// var chai = require("chai"),
//     expect = chai.expect;
// var BaseFacade = require("../lib/facade/base");

// describe("Validation", function() {

//     it("returns a number", function() {
//         for (var i = 0; i < 10; i++) {
//             expect(i).to.be.a("number");
//         }
//     });

//     it("test", function() {
        
//         var UserFacade = BaseFacade.extend();
        
//         UserFacade.prototype.get = function get(input){
//             // this.rules = [{ "user_id" : ["required" , "int"] }, { "user_name" : ["required" , { "length" : 2 } ] }];
//             // this.rules = [
//             //     { "user_name" : ["required", { "length" : [2,3] } ] }
//             // ];
//             this.rules = [ { "user_id" : [function(id){ console.log(id); if(id != "1") throw new Error("Invalid id");  }] } ];
//             this.validate(input);
//         };
        
//         var params = { "user_id" : "2" , "user_name" : "1sf" };
//         var uf = new UserFacade();
//         uf.get(params);
        
//     });

// });
