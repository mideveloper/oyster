// Base Facade

var _ = global.Packages.lodash,
    Validation_Helper = require("../helpers/validation");


// all other Facade should compose Base Facade

// Base Controller

function validateRule(rule, obj, name) {
    console.log(rule);
    if (typeof rule === "function") {
        return;
    }
    else {
        var validation = _.find(Validation_Helper.validations, function(v) {
            return v.key === rule;
        });
        if (!validation) {
            return new Error("Unknown validation");
        }
        console.log(validation);
        var err = validation.method(obj, name);
        if (err) {
            throw new Error(err);
        }
    }

}

function extend(attributes) {

    function BaseFacade(context) {

        //if base creation is not with new keyword then return it with new 
        if (!(this instanceof BaseFacade)) {
            return new BaseFacade(context);
        }

        // need to change following line probably we will have to predefine attributes that must be defined on every child facade;
        this.attributes = attributes;
        this.context = context;
        this.user_id = this.context.user_id;
        this.other_user_id = this.context.other_user_id;
        this.user_rights = this.context.user_rights;
        this.global_rules = this.validationRules();
    }

    BaseFacade.prototype.validate = function(params) {

        var rules = this.rules;
        console.log("Rules Length: " + rules.length);
        
        if (params.length === 0) {
            return new Error("Empty parameters object");
        }

        for (var i = 0; i < rules.length; i++) {
            
            var rule = rules[i];
            console.log(rule);
            var param_name; var param_rules;
            for(var name in rule){
                param_name = name;
                param_rules = rule[name];
            }
            
            console.log("param_name: " + param_name);
            console.log("param_rules: " + param_rules);
            
            var obj = params[param_name];
            
            console.log("object: " + obj);
            
            for(var j=0;j< param_rules.length;j++){
            //_.each(param_rules, function(r){
                validateRule(param_rules[j], obj, param_name);
            //});
            }
        }

    };

    BaseFacade.prototype.validationRules = function validationRules() {
        return [];
    };

    return BaseFacade;
}

module.exports = {
    extend: extend
};
