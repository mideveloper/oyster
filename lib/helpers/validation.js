var _ = global.Packages.lodash,
    Promise = global.Packages.Promise;

var Util = require("util");
var Validation_Util = require("../utils/validation"),
    Rules = require("./rules"),
    Messages = require("../constants/messages"),
    InvalidArgumentsError = require("../errors").invalidArgumentsError;

var validations = [{
    key: "required",
    method: Validation_Util.isEmpty,
    error_message: Messages.REQUIRED
}, {
    key: "int",
    method: Validation_Util.isInteger,
    error_message: Messages.INVALID_FORMAT,
    type: "integer"
}, {
    key: "number",
    method: Validation_Util.isNumber,
    error_message: Messages.INVALID_FORMAT,
    type: "number"
}, {
    key: "boolean",
    method: Validation_Util.isBoolean,
    error_message: Messages.INVALID_FORMAT,
    type: "boolean"
}, {
    key: "length",
    method: Validation_Util.isLengthInRange,
    error_message: Messages.OUT_OF_RANGE
}, {
    key: "lat",
    method: Validation_Util.isValidLatitude,
    error_message: Messages.INVALID_LAT
}, {
    key: "lon",
    method: Validation_Util.isValidLongitude,
    error_message: Messages.INVALID_LON
}, {
    key: "array",
    method: Validation_Util.isArray,
    error_message: Messages.INVALID_FORMAT,
    type: "array"
}, {
    key: "custom",
    error_message: "Custom validation failed for {0}"
}];

function validateParameterRule(rule, param_value, param_name) {

    var key, rule_value, rule_args;

    key = rule.key;
    rule_value = rule.value;
    if (rule_value === undefined || rule_value === null){
        return "Incorrect validation rule";
    }

    if (rule_value.args) {
        rule_args = rule_value.args;
    }
    var validation = _.find(validations, function(v) {
        return v.key === key;
    });

    var is_valid;

    if (validation) {
        if (rule_value.method) {
            is_valid = rule_value.method(param_value);
        }
        else if (rule_value !== false) {
            is_valid = validation.method(param_value, rule_args);
        }
    }
    else {
        return "Unknown validation";
    }

    if (is_valid === false) {

        // set error_message, default if not provided
        var error_message = rule_value.error_message ? rule_value.error_message : validation.error_message;
        if (!error_message){error_message = "%s validation failed";}

        // prepare agrs to format error message
        var args = [param_name];
        if (validation.type){args.push(validation.type);}
        if (rule_args){args = args.concat(rule_args);}

        for (var i = 0; i < args.length; i++) {
            error_message = Util.format(error_message, args[i]);
        }

        return error_message;
    }
    return;
}

function throwValidationError(err) {
    return new Promise(function() {
        throw new InvalidArgumentsError(err);
    });
}

function validateAsycnCustomRules(async_rules) {

    if (async_rules && async_rules.length > 0) {

        var async_methods = [];
        var errors = [];

        _.each(async_rules, function(rule){
            
            var p = new Promise(function(resolve, reject) {
                var err_msg = rule.error_message ? rule.error_message : "async validation failed";
                rule.method().then(function(res) {
                    if (res === false) {
                        errors.push(err_msg);
                        reject(err_msg);
                        return;
                    }
                    resolve();
                    return;
                });
            });

            async_methods.push(p);
            
        });
        
        return Promise.all(async_methods).spread(function() {
            return;
        }).
        catch (function() {
            return throwValidationError(errors);
        });
    }
    else {
        return new Promise(function(resolve) {
            resolve();
            return;
        });
    }
}

function validateCustomRules(rules) {

    var sync_rules = rules.sync;
    // var async_rules = rules.async;

    var error_messages = [];

    for (var i = 0; i < sync_rules.length; i++) {

        var rule = sync_rules[i];

        if (rule.method) {
            var is_validate = rule.method(rule);
            if (is_validate === false) {
                var error_message = rule.error_message ? rule.error_message : "custom validation failed";
                error_messages.push(error_message);
            }
        }
        else {
            error_messages.push("Method not defined for custom sync rule");
        }
    }
    if (error_messages.length > 0) {
        return throwValidationError(error_messages);
    }
    else{
        return validateAsycnCustomRules(rules.async);
    }
}

function validateRules(params, rules) {

    if (!params || params.length === 0) {
        return throwValidationError("Empty parameters object");
    }

    var default_rules = rules.
    default;
    var custom_rules = rules.custom;

    var error_messages = [];

    for (var i = 0; i < default_rules.length; i++) {

        var rule = default_rules[i];

        var param_name;
        var param_rules;

        for (var name in rule) {
            param_name = name;
            param_rules = rule[name];
        }

        var param_value = params[param_name];

        for (var r in param_rules) {
            var err = validateParameterRule({
                key: r,
                value: param_rules[r]
            }, param_value, param_name);
            if (err) {
                error_messages.push(err);
                break;
            }
        }
    }

    if (error_messages.length > 0) {
        return throwValidationError(error_messages);
    }
    else {
        return validateCustomRules(custom_rules);
    }
}

function validate(params, rules){
    
    if(!rules || !(rules instanceof Rules)){
        return new Promise(function() {
            throw new Error("second parameter must be instance of Rules"); // throw new AppError.invalidArgumentsError(error_messages);
        });
    }
    else{
        return validateRules(params, rules.get());
    }
}

module.exports.validateRules = validateRules;
module.exports.validate = validate;
