// all the custom exceptions which are inherited by Error 

var Messages = require("../constants/messages");
var Util = require("util");

// add toJSON method on error object so on stringify it will be able to generate JSON
Object.defineProperty(Error.prototype, "toJSON", {
    value: function () {
        var alt = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
            alt[key] = this[key];
        }, this);

        return alt;
    },
    configurable: true
});

var ApplicationError = function (errorMessage, constructor) {

    Error.captureStackTrace(this, constructor || this);

    if (errorMessage) {
        this.error_message = errorMessage;
    }
    else {
        this.error_message = Util.format("%s: Error message was not specified.", this.name);
    }

    this.httpCode = "500";
};

Util.inherits(ApplicationError, Error);
ApplicationError.prototype.name = "Application Error";

var unAuthenticatedError = function (err) {
    this.httpCode = "401";
    this.error_message = err ? err : Messages.AUTH_FAILED;
};
unAuthenticatedError.prototype.name = "unAuthenticatedError";
Util.inherits(unAuthenticatedError, ApplicationError);


var unAuthorizedError = function (err) {
    this.httpCode = "403";
    this.error_message = err ? err : Messages.AUTH_FAILED;
};
unAuthorizedError.prototype.name = "unAuthorizedError";
Util.inherits(unAuthorizedError, ApplicationError);

var notFoundError = function (err, arg) {
    this.httpCode = "500";
    this.error_message = err ? err : Util.format(Messages.NOT_FOUND, arg);
};
notFoundError.prototype.name = "notFoundError";
Util.inherits(notFoundError, ApplicationError);

var invalidArgumentsError = function (err) {
    this.httpCode = "400";
    this.error_message = err ? err : Messages.INVALID_ARGS;
};
invalidArgumentsError.prototype.name = "invalidArgumentsError";
Util.inherits(invalidArgumentsError, ApplicationError);


module.exports = {
    ApplicationError : ApplicationError,
    unAuthenticatedError : unAuthenticatedError,
    unAuthorizedError: unAuthorizedError,
    invalidArgumentsError: invalidArgumentsError,
    notFoundError : notFoundError
};
