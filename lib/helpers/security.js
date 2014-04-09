// Security Manager is responsible for all the rights management

var Promise = global.Packages.Promise,
    _ = global.Packages.lodash,
    unAuthorizedError = require("../errors").unAuthorizedError;

function hasRights(rightName, user_rights, current_user_id, other_user_id) {
    if (rightName === "SELF") {
        return (current_user_id === other_user_id);
    }
    else if (rightName === "NOT_SELF") {
        return (current_user_id !== other_user_id);
    }
    else {
        return _.contains(user_rights, rightName);
    }
}

function securify(obj) {
    // if obj.rights is defined and obj.rights is array 
    // then secure obj
    if (obj && obj.rights && Object.prototype.toString.call(obj.rights) === "[object Array]") {

        _.each(obj.rights, function(setting) {

            if (setting.name) { // if object has name 
                if (!hasRights(setting.name.toUpperCase(), obj.context.user_rights, obj.context.user_id, obj.context.other_user_id)) {
                    // user doesnot have rights to call the method
                    if (setting.methods && setting.methods.length > 0) {
                        _.each(setting.methods, function(method) {
                            if (obj[method]) {
                                // if method exist in the object then replace the definition of function to denial
                                obj[method] = function() {
                                    return new Promise(function() {
                                        throw new unAuthorizedError("authorization failed");
                                    });
                                };
                            }
                        });

                    }
                }
            }
        });

    }

}

module.exports.securify = securify;
