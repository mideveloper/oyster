var AppError = require("../errors"),
    Ios = require("./ios");

function Notification() {

}


Notification.prototype.setIOSClient = function addIOSClient(
dev_key_path, dev_cert_path, prod_key_path, prod_cert_path) {
    this.ios_client = new Ios(dev_key_path, dev_cert_path, prod_key_path, prod_cert_path);
};

// Notification.prototype.setAndroidClient = function addAndroidClient(){

// };

// Notification.prototype.setGoogleGlassClient = function addAndroidClient(){

// };

// Notification.prototype.setWindowsClient = function addAndroidClient(){

// };


Notification.prototype.send = function send(devices, data, is_silent) {
    this.sendToIOS(devices, data, is_silent);
};

Notification.prototype.sendToIOS = function sendToIOS(devices, data, is_silent) {

    if (!this.ios_client) {
        throw new AppError.notFoundError(null, "IOS client");
    }

    this.ios_client.send(devices, data, is_silent);

    return;
};

module.exports = Notification;

// Notification.prototype.sendToAndroid = function sendToIOS (devices, data){

// };

// Notification.prototype.sendToGoogleGlass = function sendToIOS (devices, data){

// };

// Notification.prototype.sendToWindows = function sendToIOS (devices, data){

// };
