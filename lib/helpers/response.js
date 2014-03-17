function getSuccessfullResponse(applicationData) {

    var ret = {
        meta: {
            code: 200
        },
        results: applicationData
    };

    return ret;
}

module.exports = getSuccessfullResponse;