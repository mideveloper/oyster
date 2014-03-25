/* jshint ignore:start */
function errorHandler(err, req, res, next) {
    res.send((err.httpCode) ? err.httpCode : 500, { error: err });
    global.Logger.error(err);
    return;
}

/* jshint ignore:end */

/* jshint ignore:start */
module.exports = errorHandler;
/* jshint ignore:end */