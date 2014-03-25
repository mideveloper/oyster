// all the custom exceptions which are inherited by Error 


var Util = require("util");

// add toJSON method on error object so on stringify it will be able to generate JSON
Object.defineProperty(Error.prototype, 'toJSON', {
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
        this.message = errorMessage;
    }
    else {
        this.message = Util.format("%s: Error message was not specified.", this.name);
    }

    this.httpCode = "500";
};

Util.inherits(ApplicationError, Error);
ApplicationError.prototype.name = "Application Error";

var unAuthenticatedError = function () {
    this.httpCode = "401";
};
unAuthenticatedError.prototype.name = "unAuthenticatedError";
Util.inherits(unAuthenticatedError, ApplicationError);


var unAuthorizedError = function () {
    this.httpCode = "403";
};
unAuthorizedError.prototype.name = "unAuthorizedError";
Util.inherits(unAuthorizedError, ApplicationError);

var notFoundError = function () {
    this.httpCode = "500";
};
notFoundError.prototype.name = "notFoundError";
Util.inherits(notFoundError, ApplicationError);

var invalidArgumentsError = function () {
    this.httpCode = "400";
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
