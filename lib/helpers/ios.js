var _ = global.Packages.lodash;
var Apn = global.Packages.Apn;


var apn_dev_feedback = "gateway.sandbox.push.apple.com";
var apn_dev_gateway = "gateway.sandbox.push.apple.com";


var apn_prod_feedback = "gateway.push.apple.com";
var apn_prod_gateway = "gateway.push.apple.com";


function onFeedback(devices) {
    console.log("token error");
    _.each(devices, function(device) {
        var token = device.token.toString("hex");
        global.Logger.info("APN Feedback: device with token#" + token + " to be cleared ");
    });
}

function onTransmissionError(errorCode, notification, recipient) {

    global.Logger.error("APN Transmit Error", {
        error_code: errorCode,
        data: notification,
        recipient: recipient
    });

    if (errorCode === 8) {
        // if token is invalid then clear it from the database
        console.log("invalid token");
    }
    else {
        console.log("some error");
    }
}

function initApnFeedback(options) {

    var apnFeedback = new Apn.Feedback(options);
    apnFeedback.on("feedback", onFeedback);
}

function onTransmitted(notification, recipient) {
    recipient = "nobody"; // fixing jslint issue
    if (notification.payload !== undefined && notification.payload !== null) {
        console.log("sent");
    }
}

var initApnSend = function(ctx) {

    if (!ctx.apn_connection) {

        var options = {};

        if (global.Environment === "production") {
            options = {
                "gateway": apn_prod_gateway,
                "key": ctx.apn.prod_key,
                "cert": ctx.apn.prod_cert,
                "address": apn_prod_feedback,
                "interval": 43200,
                "batchFeedback": true
            };
        }
        else {
            options = {
                "gateway": apn_dev_gateway,
                "key": ctx.apn.dev_key,
                "cert": ctx.apn.dev_cert,
                "address": apn_dev_feedback,
                "interval": 43200,
                "batchFeedback": true
            };
        }

        ctx.apn_connection = new Apn.Connection(options);
        ctx.apn_connection.on("transmissionError", onTransmissionError);
        ctx.apn_connection.on("transmitted", onTransmitted);

        delete options.gateway;

        initApnFeedback(options);

    }

    return ctx.apn_connection;
};

function buildPayload(options) {

    var payload = new Apn.Notification(options.payload);
    payload.expiry = options.expiry || 0;
    
    
    if (options.alert) { //
        payload.alert = options.alert;
    }
    else{
        payload.payload.smsg = options.data.message;
    }
    
    if (options.badge) {
        payload.badge = options.badge;
    }
    if (options.sound) {
        payload.sound = options.sound;
    }
    if (options.image) {
        payload["launch-image"] = options.image;
    }
    if (options.data) {
        payload.payload = {
            event_type: options.data.event_type
        };

        if (options.data.identifier) {
            payload.payload.identifier = options.data.identifier;
        }

    }

    
    payload["content-available"] = 1;
    payload["contentAvailable"] = 1;
    
    return payload;
}

function push(ctx, tokens, payload) {

    var sender = initApnSend(ctx);
    //global.Logger.info('APN Push: token ' + JSON.stringify(tokens) + ', payload ' + JSON.stringify(payload) + ', sender' + JSON.stringify(sender));

    sender.pushNotification(payload, tokens);
}

function Ios(dev_key_path, dev_cert_path, prod_key_path, prod_cert_path) {

    this.apn = {
        prod_key: prod_key_path,
        prod_cert: prod_cert_path,
        dev_key: dev_key_path,
        dev_cert: dev_cert_path
    };
}

Ios.prototype.send = function(devices, data, is_silent) {

    var self = this;
    var _message = data.message || null,
        _soundFile = data.sound_file || "beep.wav",
        _iconFile = data.icon_file || null,
        _data = data;

    var iosDevices = _.filter(devices, function(device) {
        if (device.platform === "apple" && device.push_token !== null) {
            if (device.push_token.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    });


    // Need to take unique set as push_token persists across install/uninstalled but device ID changes
    var iosTokens = _.unique(_.pluck(iosDevices, "push_token"));

    //we are only to push if there are valid devices
    if (iosTokens.length > 0) {

        //registering one callback per Notification ID
        
        var options = {
            alert: (!is_silent) ? _message : null,
            sound: (!is_silent) ? _soundFile : null,
            image: _iconFile,
            data: _data
        };
        
        
        
        
        var notificationPayload = buildPayload(options);

        push(self, iosTokens, notificationPayload);
        //global.Trace.write(data.to_id, "push sent to user", notificationPayload, null);
        return;
    }
    return;
};

module.exports = Ios;