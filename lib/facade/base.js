// Base Facade

// all other Facade should compose Base Facade

var _ = global.Packages.lodash,
Obj = require("../utils/obj");
// Base Controller

function prepareParams(context) {
    var params = {};

    for (var propt_params in context.params) {
        Obj.define(params, propt_params, context.params[propt_params]);
    }
   
    for (var propt_body in context.body) {
        Obj.define(params, propt_body, context.body[propt_body]);
    }

    for (var propt_query in context.query) {
        Obj.define(params, propt_query, context.query[propt_query]);
    }

    return params;
}

function extend(attributes){
    
    function BaseFacade(context){
        
        //if base creation is not with new keyword then return it with new 
        if (!(this instanceof BaseFacade)) {
            return new BaseFacade(context);
        }
        // need to change following line probably we will have fix attributes that must be defined on every child facade;
        this.attributes = attributes;
        
        this.context = context;
        this.input = {};
        this.user_id = this.context.user_id;
        this.other_user_id = this.context.other_user_id;
        this.user_rights = this.context.user_rights;
        _.assign(this.input, prepareParams(context));
        this.input.user_id = this.user_id;
    }
    
    return BaseFacade;
}

module.exports = {
    extend : extend
};

