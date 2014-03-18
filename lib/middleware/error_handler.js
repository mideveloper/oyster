function errorHandler(err, req, res) {
    res.send((err.httpCode) ? err.httpCode : 500, { error: err });
    return;
}

module.exports = errorHandler;