
var invalidArgumentsError = require("../errors").invalidArgumentsError;
function Rules(child_rules) {
    //if rules creation is not with new keyword then return it with new 
    if (!(this instanceof Rules)) {
        return new Rules();
    }

    if (child_rules && child_rules instanceof Rules) {
        this.rules = child_rules.get();
    }
    else {
        this.rules = {
            custom: { sync: [], async: [] },
            default: []
        };
    }

}

Rules.prototype.addCustomAsync = function addCustomAsync(error_msg, method) {

    this.rules.custom.async.push({
        error_message: error_msg,
        method: method
    });

    return this;
};

Rules.prototype.addCustomSync = function addCustomSync(error_msg, method) {
    this.rules.custom.sync.push({
        error_message: error_msg,
        method: method
    });

    return this;
};

Rules.prototype.add = function add(param_name, validations) {
    var validation_obj = {};
    validation_obj[param_name] = validations;

    this.rules.default.push(validation_obj);
    return this;
};

Rules.prototype.addMulti = function addMulti(validation_objs) {
    if (!(validation_objs instanceof Array)) {
        throw new invalidArgumentsError("must be array");
    }

    this.rules.default = this.rules.default.concat(validation_objs);
    return this;
};

Rules.prototype.get = function get() {
    return this.rules;
};

module.exports = Rules;

