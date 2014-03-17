
function clone(obj) {

    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" !== typeof obj){
        return obj;
    }
    
    var copy;
    
    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                if (obj[attr] instanceof Buffer){
                    copy[attr] = obj[attr][0] === 1 ? true : false;
                }
                else{
                    copy[attr] = clone(obj[attr]);
                }
            }
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function define(object, name, value) {
    Object.defineProperty(object, name, {
        value: value,
        enumerable: true
    });
}

exports.clone = clone;
exports.define = define;
