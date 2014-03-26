/* jshint ignore:start */
var Messages = require("../constants/messages");

function getFailedResponse(err){
    
    var error_message;
    var http_code = err.httpCode ? err.httpCode : 500;
    
    if(http_code === 500){
        if(global.showExceptionToClient){
            error_message = err.error_message;
        }
        else{
            error_message = Messages.INTERNAL_ERROR;
        }
    }
    else{
        error_message = err.error_message;
    }
    
    return {
        meta: {
            code: http_code,
            message: error_message
        }
    };
}

function errorHandler(err, req, res, next) {
    
    var failed_response = getFailedResponse(err);
    res.send( failed_response.meta.code , { error: failed_response.meta });
    if(failed_response.meta.code === 500)
        global.Logger.error(err);
    return;
}

/* jshint ignore:end */

/* jshint ignore:start */
module.exports = errorHandler;
/* jshint ignore:end */