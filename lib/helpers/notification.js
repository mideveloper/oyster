var AppError = require("../errors"),
    Ios = require("./ios");

function Notification(){
  
}


Notification.prototype.addIOSClient = function addIOSClient(
    dev_key_path, dev_cert_path, prod_key_path, prod_cert_path
){
    this.ios_client = new Ios(dev_key_path, dev_cert_path, prod_key_path, prod_cert_path);
};

// Notification.prototype.addAndroidClient = function addAndroidClient(){
    
// };

// Notification.prototype.addGoogleGlassClient = function addAndroidClient(){
    
// };

// Notification.prototype.addWindowsClient = function addAndroidClient(){
    
// };


Notification.prototype.send = function send(devices, data){
    this.sendToIOS(devices, data);
};

Notification.prototype.sendToIOS = function sendToIOS (devices, data){
    
    if(!this.ios_client){
        throw new AppError.notFoundError(null, "IOS client");
    }
    
    this.ios_client.send(devices, data);
   
    return;
};

module.exports = Notification;

// Notification.prototype.sendToAndroid = function sendToIOS (devices, data){
    
// };

// Notification.prototype.sendToGoogleGlass = function sendToIOS (devices, data){
    
// };

// Notification.prototype.sendToWindows = function sendToIOS (devices, data){
    
// };

