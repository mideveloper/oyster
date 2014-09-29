var _application = {};

function set(key, value) {
    _application[key] = value;
}

function get(key) {
    return _application[key];
}

module.exports = {
    set: set,
    get: get
};