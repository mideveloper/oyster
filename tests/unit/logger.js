require("../../components/index")();
require("../../lib/utils/logger")("demo");

describe("should log ", function() {

    it("messages", function() {
        
        global.Logger.errorRequest("failed");
        global.Logger.info("test run");
        global.Logger.crash("test crash");
    });
});