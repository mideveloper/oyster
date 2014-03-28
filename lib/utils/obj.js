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

function getParamsObject(context) {
    var params = {};

    for (var propt_params in context.params) {
        params[propt_params] = context.params[propt_params];
        //define(params, propt_params, context.params[propt_params]);
    }
   
    for (var propt_body in context.body) {
        params[propt_body] = context.body[propt_body];
        //define(params, propt_body, context.body[propt_body]);
    }

    for (var propt_query in context.query) {
        params[propt_query] = context.query[propt_query];
        //define(params, propt_query, context.query[propt_query]);
    }

    return params;
}

exports.clone = clone;
exports.getParamsObject = getParamsObject;
exports.define = define;
