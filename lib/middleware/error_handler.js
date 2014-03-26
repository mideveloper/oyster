/* jshint ignore:start */
var constants = require("../constants");

function getFailedResponse(err){
    
    var error_message;
    var http_code = err.httpCode ? err.httpCode : 500;
    
    if(http_code === 500){
        if(global.showExceptionToClient){
            error_message = err.error_message;
        }
        else{
            error_message = constants.messages.INTERNAL_ERROR;
        }
    }
    else{
        error_message = err.error_message;
    }
    
    return {
        http_code: http_code,
        error_message: error_message
    };
}

function errorHandler(err, req, res, next) {
    
    var failed_respone = getFailedResponse(err);
    res.send( failed_respone.http_code , { error: failed_respone.error_message });
    global.Logger.error(err);
    return;
}

/* jshint ignore:end */

/* jshint ignore:start */
module.exports = errorHandler;
/* jshint ignore:end */