require("../../../components/index")();
var arr = require("../../../lib/utils/arr"),
    chai = require("chai"),
    expect = chai.expect;

describe("arr ", function() {

    it("shuffle", function() {

        var temp_array = [1, 2, 3, 4, 5];

        temp_array = arr.shuffle(temp_array);

        var pass = false;
        for (var i = 1; i <= temp_array.length; i++) {

            if (temp_array[i - 1] !== i) {
                pass = true;
                expect(true).to.be.true;

            }

        }

        expect(pass).to.be.true;

    });
});