var Util = require("util"),
    Messages = require("../constants/messages"),
    AppError = require("../errors");

function isEmpty(value, name) {
    if (value === undefined || value === null || value === "" || ((Object.prototype.toString.call(value) === "[object Array]") && value.length === 0)) {

        var msg = Util.format(Messages.REQUIRED, name);
        return msg;
    }
}

function isBoolean(value, name) {
    if (!(value === true || value === false)) {
        var msg = Util.format(Messages.INVALID_FORMAT, name, "boolean");
        return msg;
    }
}

function isArray(value, name) {
    if (Object.prototype.toString.call(value) !== "[object Array]") {
        var msg = Util.format(Messages.INVALID_FORMAT, name, "array");
        return msg;
    }
}

function isNumber(value, name) {

    // if (value) { // <<-- wrong because of Number.NaN
    if (value !== null && value !== undefined) {
        if (typeof value === "object" || isNaN(value)) {
            var msg = Util.format(Messages.INVALID_FORMAT, name, "numeric");
            return msg;
        }
    }

    // // If there is some value and it is not "number" data type
    // if (value && typeof value !== "number") {
    //     if ( (typeof value === "string" && (!value.match(/^-?\d*(\.\d+)?$/))) ||  (typeof value !== "string") ) {
    //         var msg = Util.format(Messages.INVALID_FORMAT, name, "numeric");
    //         return msg;
    //     }
    // }
}

function isInteger(value, name) {

    var msg = isNumber(value, name);
    if (msg) {
        return msg;
    }
    else if (value % 1 !== 0) {
        msg = Util.format(Messages.INVALID_FORMAT, name, "integer");
        return msg;
    }

    // if (value && !value.match(/^-?\d+$/)) {
    //     var msg = Util.format(Messages.INVALID_FORMAT, name, "integer");
    //     return msg;
    // }
}

function isIntegerUnsigned(value, name) {

    var msg = isNumber(value, name);
    if (msg) {
        return msg;
    }
    else if (value % 1 !== 0 || value < 0) {
        msg = Util.format(Messages.INVALID_FORMAT, name, "unsigned integer");
        return msg;
    }
}

/*function isDate(value, name) {
    if (value && !DateHelper.isValid(value)) {

        var msg = Util.format(Messages.INVALID_FORMAT, name, "valid date");
        return msg;
    }
}

function isUTCDate(value, name) {

    if (value) {

        var dt = DateHelper.toDate(value);

        if(dt && !DateHelper.isValid(dt)) {
            var msg = Util.format(Messages.INVALID_FORMAT, name, "valid utc date");
            return msg;
        }
    }
}*/

// Latitude is a value of floating data type between [-90, 90]
//
function isValidLatitude(value, name) {
    var msg = isNumber(value, name);
    if (msg) {
        return msg;
    }
    else if (value > 90 || value < -90) {
        msg = Util.format(Messages.INVALID_LAT, name);
        return msg;
    }
}

// Longitude is a value of floating data type between [-180, 180]
//
function isValidLongitude(value, name) {
    var msg = isNumber(value, name);
    if (msg) {
        return msg;
    }
    else if (value > 180 || value < -180) {
        msg = Util.format(Messages.INVALID_LON, name);
        return msg;
    }
}

function isNumberInRange(value, name, rangeArgs) {
    var msg = null;

    if (rangeArgs && rangeArgs.length === 2) {
        var min = rangeArgs[0];
        var max = rangeArgs[1];

        if ((min && value < min) || (max && value > max)) {
            msg = Util.format(Messages.OUT_OF_RANGE, name, (min || min === 0) ? min : "any", (max || max === 0) ? max : "any");
        }
    }
    else {
        msg = Util.format(Messages.INVALID_FORMAT, "validation.range arguments", "array of two elements [min, max]");
    }

    return msg;
}

function isLengthInRange(value, name, rangeArgs) {
    var msg = null;

    if (value.length !== undefined) {
        msg = isNumberInRange(value.length, "length of " + name, rangeArgs);
    }
    else {
        msg = Util.format(Messages.INVALID_FORMAT, name, "length property is missing");
    }

    return msg;
}

// validation of json schema against the object provided
//

// Validates arguments by evaluating supplied rules against actual argument values.
function validateArguments(rules) {

    var messagesArray = [];

    for (var i = 0; i < rules.length; i++) {

        var rule = rules[i];
        var value = rules[i].value;

        var isRequired = (rule.required === undefined || rule.required === null) ? false : rule.required;
        var paramName = rule.param;

        if (isRequired === true || (isRequired === false && (value || value === 0))) {


            var err = isEmpty(value, paramName);
            if (err) {
                messagesArray.push(err);
            }
            else {
                if (rule.validation) {

                    for (var j = 0; j < rule.validation.length; j++) {

                        var method = rule.validation[j].method;
                        var methodArgs = rule.validation[j].args;

                        err = method(value, paramName, methodArgs);
                        if (err) {
                            messagesArray.push(err);
                            break;
                        }

                    } // iterate thru validators

                }
            }
        }
    } // iterate thru parameters

    if (messagesArray.length > 0) {
        return new AppError.invalidArgumentsError(messagesArray);
    }
    else {
        return null;
    }
}


module.exports.validateArguments = validateArguments;
module.exports.empty = isEmpty;
module.exports.float = isNumber;
module.exports.int = isInteger;
module.exports.intUnsigned = isIntegerUnsigned;
module.exports.lat = isValidLatitude;
module.exports.lon = isValidLongitude;
module.exports.range = isNumberInRange;
module.exports.lengthRange = isLengthInRange;
module.exports.array = isArray;
module.exports.bool = isBoolean;

/*module.exports.date = isDate;
module.exports.utcDate = isUTCDate;*/


var validations = [{
    key: "int",
    method: isInteger
}, {
    key: "required",
    method: isEmpty
}, {
    key: "length",
    method: isLengthInRange
}];

module.exports.validations = validations;