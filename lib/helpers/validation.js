var _ = global.Packages.lodash;
var Util = require('util');
var Validation_Util = require("../utils/validation"),
    Messages = require("../constants/messages"),
    AppError = require("../errors");

var validations = [
    {
        key: "required", method: Validation_Util.isEmpty, error_message : Messages.REQUIRED
    },
    {
        key: "int", method: Validation_Util.isInteger, error_message : Messages.INVALID_FORMAT, type: "integer"
    },
    {
        key: "number", method: Validation_Util.isNumber, error_message : Messages.INVALID_FORMAT, type: "number"
    },
    {
        key: "boolean", method: Validation_Util.isBoolean, error_message : Messages.INVALID_FORMAT, type: "boolean"
    },
    {
        key: "length", method: Validation_Util.isLengthInRange, error_message: Messages.OUT_OF_RANGE
    },
    {
        key: "lat", method: Validation_Util.isValidLatitude, error_message: Messages.INVALID_LAT
    },
    {
        key: "lon", method: Validation_Util.isValidLongitude, error_message: Messages.INVALID_LON
    },
    {
        key: "array", method: Validation_Util.isArray, error_message: Messages.INVALID_FORMAT, type: "array"
    },
    {
        key: "custom", error_message: "Custom validation failed for {0}"
    }
];

function validateRules(params, rules){
    
    if (params.length === 0) {
        return new Error("Empty parameters object");
    }
    
    var error_messages = [];
    
    for (var i = 0; i < rules.length; i++) {
        
        var rule = rules[i];
        
        var param_name; var param_rules;
        
        for(var name in rule){
            param_name = name;
            param_rules = rule[name];
        }
        
        var param_value = params[param_name];
        
        for(var r in param_rules){
            var err = validateParameterRule({ key : r , value: param_rules[r]}, param_value, param_name);
            if(err){
                error_messages.push(err);
                break;
            }
        }
    }
    
    if (error_messages.length > 0) {
        return error_messages; // throw new AppError.invalidArgumentsError(error_messages);
    }
    else {
        return;
    }
}

function validateParameterRule(rule, param_value, param_name) {
    
    var key, rule_value, rule_args;
    
    key = rule.key;
    rule_value = rule.value;
    if(rule_value === undefined || rule_value === null) 
        return new Error("Incorrect validation rule");
    
    if(rule_value.args){
        rule_args = rule_value.args;
    }
    var validation = _.find(validations, function(v) {
        return v.key === key;
    });
    
    var is_valid;
    
    if(validation){
        if(rule_value.method){
            is_valid =  rule_value.method(param_value);
        }
        else if(rule_value !== false){
            is_valid = validation.method(param_value, rule_args);
        }
    }
    else{
        return new Error("Unknown validation");
    }
    
    if (is_valid === false ) {
        
        // set error_message, default if not provided
        var error_message = rule_value.error_message ? rule_value.error_message : validation.error_message;
        if(!error_message) error_message = "%s validation failed";
        
        // prepare agrs to format error message
        var args = [param_name]; 
        if(validation.type) 
            args.push(validation.type);
        if(rule_args)
            args = args.concat(rule_args);
        
        for (var i = 0; i < args.length; i++){
            error_message = Util.format(error_message, args[i]);
        }
        
       return error_message;
    }
    return;
}

//module.exports.validations = validations;
module.exports.validateRules = validateRules;