// var _ = global.Packages.lodash;
// var Apn = global.Packages.Apn;
// var AppErrors = require("../errors");
// var AppApnKeys = require("../models/app_apnkeys");



// var apn_dev_feedback  = "gateway.sandbox.push.apple.com";
// var apn_dev_gateway = "gateway.sandbox.push.apple.com";


// var apn_prod_feedback  = "gateway.sandbox.push.apple.com";
// var apn_prod_gateway = "gateway.sandbox.push.apple.com";
// var _all_apn_keys;

// function loadAllAPPAPNKeys(){
//     return new AppApnKeys().find().then(function(all_apn_keys){
//         _all_apn_keys = all_apn_keys;
//     });
// }

// function onFeedback(devices) {
//     //clearing Push Token for provided devices
//     _.each(devices, function(device) {
//         var token = device.token.toString("hex");
//         global.Logger.info("APN Feedback: device with token#" + token + " to be cleared ");
//         //UserDevices.clearPushToken(token, onTokenCleared);
//     });
// }

// function onTransmissionError(errorCode, notification, recipient) {
    
//     global.Logger.error("APN Transmit Error", {
//         error_code: errorCode,
//         data: notification,
//         recipient: recipient
//     });
//     //var token = recipient.token.toString("hex");
//     if (errorCode === 8) {
//         // if token is invalid then clear it from the database
//         console.log("invalid token");
//         //UserDevices.clearPushToken(token, onTokenCleared);
//     }
// }

// function initApnFeedback(options) {
    
//     var apnFeedback = new Apn.Feedback(options);
//     apnFeedback.on("feedback", onFeedback);
// }

// function onTransmitted(notification, recipient) {
//     if (notification.payload !== undefined && notification.payload !== null) { console.log("sent"); }
// }

// var _apns = [];
// var initApnSend = function(app_id) {
    
    
//     var apn_key = _.find(_all_apn_keys, function(apnkey){
//         return apnkey.app_id === app_id;     
//     });
    
//     if(!apn_key){
//       throw new AppErrors.ApplicationError("APN Key not found for APP"); 
//     }
    
//     var options = {};
    
//     if(global.Environment === "production"){
//         options = {
//             "gateway": apn_prod_gateway,
//             "key": apn_key.prod_key,
//             "cert": apn_key.prod_cert,
//             "address" : apn_prod_feedback,
//             "interval": 43200,
//             "batchFeedback": true
//         };
//     }
//     else {
//         options = {
//             "gateway": apn_dev_gateway,
//             "key": apn_key.dev_key,
//             "cert": apn_key.dev_cert,
//             "address" : apn_dev_feedback,
//             "interval": 43200,
//             "batchFeedback": true
//         };
        
        
//     }
    
//     var apn_connection = _.find(_apns, function(apn){
//         return apn.key === global.Environment + ":" + app_id;
//     });
    
//     if(!apn_connection){
//         apn_connection = new Apn.Connection(options);
//         apn_connection.on("transmissionError", onTransmissionError);
//         apn_connection.on("transmitted", onTransmitted);
        
//         delete options.gateway;
        
//         initApnFeedback(options);
//         _apns.push(global.Environment + ":" + app_id, apn_connection);    
//     }
    
//     return apn_connection;
    
   
// };

// function onTokenCleared(err, devices) {
//     if (devices) {
//         _.each(devices, function(d) {
//             global.Trace.writeError(d.user_id, "transmission Or Feedback returned from Apple for device = " + d.udid, d);
//         });
//     }
//     return null;
//     //Q: do we need to do anything when the device with invalid token had this token cleared?   
// }

// function buildPayload(options) {
    
//     var payload = new Apn.Notification(options.payload);
//     payload.expiry = options.expiry || 0;
//     if (options.alert) { //
//         payload.alert = options.alert;
//     }
//     if (options.badge) {
//         payload.badge = options.badge;
//     }
//     if (options.sound) {
//         payload.sound = options.sound;
//     }
//     if (options.image) {
//         payload["launch-image"] = options.image;
//     }
//     if (options.data) {
//         payload.payload = {
//             event_type: options.data.event_type
//         };
        
//         if (options.data.conversation_id) {
//             payload.payload.conversation_id = options.data.conversation_id;
//         }
//         if (options.data.receiverClientId) {
//             payload.payload.receiverClientId = options.data.receiverClientId;
//         }
//         if (options.data.senderClientId) {
//             payload.payload.senderClientId = options.data.senderClientId;
//         }
//     }
//     if (options["content-available"]) {
//         payload["content-available"] = 1;
//         payload["contentAvailable"] = 1;
//     }
//     return payload;
// }

// function push(app_id, tokens, payload) {
    
//     var sender = initApnSend(app_id);
//     //global.Logger.info('APN Push: token ' + JSON.stringify(tokens) + ', payload ' + JSON.stringify(payload) + ', sender' + JSON.stringify(sender));
//     sender.pushNotification(payload, tokens);
// }

// function sendMessage(app_id, devices, event_type, data) {
    
//     var _message = data.message || null,
//         _soundFile = data.sound_file || "beep.wav",
//         _iconFile = data.icon_file || null,
//         _data = data;
        
//     _data.event_type = event_type;
        
//     var iosDevices = _.filter(devices, function(device) {
//         if (device.platform === "iphone" && device.push_token !== null) {
//             if (device.push_token.length > 0) {
//                 return true;
//             }
//             else {
//                 return false;
//             }
//         }
//         else {
//             return false;
//         }
//     });
        
//     // Need to take unique set as push_token persists across install/uninstalled but device ID changes
//     var iosTokens = _.unique(_.pluck(iosDevices, "push_token"));
    
//     //we are only to push if there are valid devices
//     if (iosTokens.length > 0) {
        
//         //registering one callback per Notification ID
    
//         var notificationPayload = buildPayload({
//             alert: _message,
//             sound: _soundFile,
//             image: _iconFile,
//             data: _data
//         });
    
//         push(app_id, iosTokens, notificationPayload);
//         //global.Trace.write(data.to_id, "push sent to user", notificationPayload, null);
//         return;
//     }
//     return;
// }

// module.exports = {
//     sendMessage: sendMessage,
//     loadAllAPPAPNKeys : loadAllAPPAPNKeys
// };