
function prepareParamObject(req, res, next){
    req.getInputObject = function(){
        return require("../utils/obj").getParamsObject(req);
    };
    next();
}

module.exports = prepareParamObject;