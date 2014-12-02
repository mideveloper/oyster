var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect;

require("../../components")();

chai.use(chaiAsPromised);



describe("Notification", function() {
     this.timeout(15000);
    var Notification = require("../../lib/helpers/notification");
   
    var notification;
    before(function() {
        notification = new Notification();
        notification.addIOSClient("../assets/client_stg_consumer_key.pem", "../assets/client_stg_consumer_cert.pem","../assets/client_stg_consumer_key.pem", "../assets/client_stg_consumer_cert.pem");
        console.log("init");

    });

    after(function() {

    });

    it("sendNotification", function(done) {
        notification.send(
            [{ push_token : "00fd174023674ac38db921af077253c2994aa0bb40a35c9043ad5796cd94caca", platform : "iphone"}], { message : "this is new message"});
        
        setTimeout(function () {
            console.log("its done");
            done();
        }, 10000);
    });

    

});
