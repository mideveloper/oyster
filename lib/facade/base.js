// Base Facade

var _ = global.Packages.lodash,
    Validation_Helper = require("../helpers/validation");


// all other Facade should compose Base Facade

// Base Controller

function extend(attributes) {

    function BaseFacade(context) {

        //if base creation is not with new keyword then return it with new 
        if (!(this instanceof BaseFacade)) {
            return new BaseFacade(context);
        }

        // need to change following line probably we will have to predefine attributes that must be defined on every child facade;
        this.attributes = attributes;
        this.context = context;
        // this.user_id = this.context.user_id;
        // this.other_user_id = this.context.other_user_id;
        // this.user_rights = this.context.user_rights;
        this.global_rules = this.validationRules();
    }

    BaseFacade.prototype.validate = function validate(params) {
        
        var custom_sync_rules = [];
        var custom_async_rules = [];
        
        var default_rules = [];
        
        // merge all global and function specific rules
        
        if(this.global_rules.default && this.global_rules.default.length > 0){
            default_rules = default_rules.concat(this.global_rules.default);    
        }
        
        if(this.rules.default && this.rules.default.length > 0){
            default_rules = default_rules.concat(this.rules.default);
        }
        
        if(this.global_rules.custom){
            
            if(this.global_rules.custom.sync && this.global_rules.custom.sync.length > 0){
                custom_sync_rules = custom_sync_rules.concat(this.global_rules.custom.sync);
            }
            
            if(this.global_rules.custom.async && this.global_rules.custom.async.length > 0){
                custom_async_rules = custom_async_rules.concat(this.global_rules.custom.async);
            }
        }
        
        if(this.rules.custom){
        
            if(this.rules.custom.sync && this.rules.custom.sync.length > 0){
                custom_sync_rules = custom_sync_rules.concat(this.rules.custom.sync);
            }
            
            if(this.rules.custom.async && this.rules.custom.async.length > 0){
                custom_async_rules = custom_async_rules.concat(this.rules.custom.async);
            }
        }
        
        var rules = {
            custom: { sync: custom_sync_rules, async: custom_async_rules},
            default: default_rules
        };
        
        return Validation_Helper.validateRules(params, rules);
    };

    BaseFacade.prototype.validationRules = function validationRules() {
        return {};
    };

    return BaseFacade;
}

module.exports = {
    extend: extend
};
