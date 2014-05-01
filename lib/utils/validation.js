function isEmpty(value) {
    if (value === undefined || value === null || value === "" || ((Object.prototype.toString.call(value) === "[object Array]") && value.length === 0) || (typeof value === 'string' && value.trim() === "" ) {
        return false;
    }
    return true;
}

function isBoolean(value) {

    if (value !== null && value !== undefined) {
        if (!(value === true || value === false)) {
            return false;
        }
    }
    return true;
}

function isArray(value) {
    if (Object.prototype.toString.call(value) !== "[object Array]") {
        return false;
    }
    return true;
}

function isNumber(value) {

    if (value !== null && value !== undefined) {
        if (typeof value === "object" || isNaN(value)) {
            return false;
        }
    }
    return true;
}

function isInteger(value) {

    if (value !== null && value !== undefined) {
        if (!isNumber(value)){return false;}
        else if (value % 1 !== 0) {
            return false;
        }
    }
    return true;
}

function isIntegerUnsigned(value) {
    if (value !== null && value !== undefined) {
        if (!isNumber(value)){return false;}
        else if (value % 1 !== 0 || value < 0) {
            return false;
        }
    }
    return true;
}

// Latitude is a value of floating data type between [-90, 90]
//
function isValidLatitude(value) {
    if (value !== null && value !== undefined) {
        if (!isNumber(value)){return false;}
        else if (value > 90 || value < -90) {
            return false;
        }
    }
    return true;
}

// Longitude is a value of floating data type between [-180, 180]
//
function isValidLongitude(value) {
    if (value !== null && value !== undefined) {
        if (!isNumber(value)){return false;}
        else if (value > 180 || value < -180) {
            return false;
        }
    }
    return true;
}

function isNumberInRange(value, rangeArgs) {

    if (rangeArgs && rangeArgs.length === 2) {
        var min = rangeArgs[0];
        var max = rangeArgs[1];

        if ((min && value < min) || (max && value > max)) {
            return false;
        }
    }
    else {
        return false;
    }
    return true;
}

function isLengthInRange(value, rangeArgs) {

    if (value !== null && value !== undefined) {
        if (value.length !== undefined) {
            if (!rangeArgs){return false;}
            if (rangeArgs.length === 1) {
                rangeArgs.push(rangeArgs[0]);
            }
            return isNumberInRange(value.length, rangeArgs);
        }
        else {
            return false;
        }
    }
    return true;
}

module.exports.isEmpty = isEmpty;
module.exports.isNumber = isNumber;
module.exports.isInteger = isInteger;
module.exports.isIntegerUnsigned = isIntegerUnsigned;
module.exports.isValidLatitude = isValidLatitude;
module.exports.isValidLongitude = isValidLongitude;
module.exports.isNumberInRange = isNumberInRange;
module.exports.isLengthInRange = isLengthInRange;
module.exports.isArray = isArray;
module.exports.isBoolean = isBoolean;
