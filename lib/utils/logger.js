// Logger

var _ = global.Packages.lodash;
var Winston = global.Packages.Winston;
var path = require("path");

var log_paths = {
    crash: "crashes/crashes.log",
    error: "errors/errors.log",
    info: "info/info.log",
    web: "web/web.log"
};

// Logger constructor
var logger = (function() {

    function Logger(app_name, dir, transport_options) {
        
        var transports = {},
        types = ["web", "info", "error", "crash"];

        this.app_name = app_name;
        
        var directory_path = dir ? dir : path.resolve("logs"); // default location "logs"
        
        // Instantiate Logging 
        _.each(types, function(type) {


            transports[type] = [
                new Winston.transports.File({
                    filename: directory_path + "/" + log_paths[type]
                })
            ];

            // Only add Console if we have it in our config
            if (transport_options && transport_options.console) {
                transports[type].push(
                new(Winston.transports.Console)({
                    json: true,
                    timestamp: true
                }));
            }
        });

        this._info = new(Winston.Logger)({
            transports: transports.info
        });
        this._error = new(Winston.Logger)({
            transports: transports.error
        });
        this._crash = new(Winston.Logger)({
            transports: transports.crash
        });

        global.Logger = this;
    }
    
    Logger.generator = function(app_name, dir, transport_options) {

        if (process.env.NODE_ENV === "test") {
            return function() {};
        }
        if (!(this instanceof Logger)) {
            return new Logger(app_name, dir, transport_options);
        }
    };

    // Log info.
    // - txt is just a text string of this log entry
    // - metadata is an optional dictionary of additional stuff to send along to
    //   the logging services
    Logger.prototype.info = function(txt, metadata) {

        txt = txt || "";
        metadata = metadata || {};

        _.assign(metadata, createLogObject("info", this.app_name));

        this._info.info(txt, metadata);
    };

    Logger.prototype.errorRequest = function(err, metadata) {
        err = err || "";
        metadata = metadata || {};

        var message;

        _.assign(metadata, createLogObject("error", this.app_name));
        _.assign(metadata, {
            err: err
        });

        if (!_.isObject(err)) {
            message = err;
        }
        else {
            if (err.name === "unExpectedError") {
                message = err.getErrorDetail();

                var last_error = err.getLastError(); //getting inner most error
                if (_.isObject(last_error)){ // if its an object then set stack
                    _.assign(metadata, {
                        stack: last_error.stack
                    });
                }
            }
            else {
                message = err.message;
                _.assign(metadata, {
                    stack: err.stack
                });
            }

        }

        // If we have the request object, add the URL to the message
        if (metadata.req) {
            metadata.url = metadata.req.url;
            metadata.body = metadata.req.body;
            metadata.params = metadata.req.params;

            _.assign(metadata, {
                url: metadata.req.url
            });
            message += "\n    url: " + metadata.req.url;

            // We cant send along the whole req object as it causes the logs to blow up
            delete metadata.req;
        }

        if (metadata.res) {
            // Can't send along the whole res object as it causes the logs to blow up
            delete metadata.res;
        }

        this._error.error(message, metadata);
    };

    Logger.prototype.error = function(err, metadata) {
        this.errorRequest(err, metadata);
    };

    Logger.prototype.crash = function(err, metadata) {
        err = err || "";
        metadata = metadata || {};

        var message;

        _.assign(metadata, createLogObject("critical", this.app_name));
        _.assign(metadata, {
            err: err
        });

        if (!_.isObject(err)) {
            message = err;
        }
        else {
            if (err.name === "unExpectedError") {
                message = err.getErrorDetail();

                var last_error = err.getLastError(); //getting inner most error
                if (_.isObject(last_error)){ // if its an object then set stack
                    _.assign(metadata, {
                        stack: last_error.stack
                    });
                }
            }
            else {
                message = err.message;
                _.assign(metadata, {
                    stack: err.stack
                });
            }
        }

        // If we have the request object, add the URL to the message
        if (metadata.req) {
            _.assign(metadata, {
                url: metadata.req.url
            });
            message += "\n    url: " + metadata.req.url;
        }

        this._crash.error(message, metadata);
    };

    var createLogObject = function(severity, app_name) {
        return {
            app: app_name,
            env: process.env.NODE_ENV,
            severity: severity
        };
    };

    return Logger;

})();


module.exports = logger.generator;
