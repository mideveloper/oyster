var Crypto = require("crypto");

function sha1(value) {
    var hash = Crypto.createHash("sha1");
    hash.update(value, "utf8");
    var hashedValue = hash.digest("hex");
    return hashedValue;
}

function sha1_base64(value) {
    var hash = Crypto.createHash("sha1");
    hash.update(value, "utf8");
    var hashedValue = hash.digest("base64");
    return hashedValue;
}

function sha1_base64_urlsafe(value) {
    var hash = Crypto.createHash("sha1");
    hash.update(value, "utf8");
    var hashedValue = hash.digest("base64");

    // Replace + with -
    hashedValue = hashedValue.replace(/\+/g, "-");
    // Replace \ with _
    hashedValue = hashedValue.replace(/\//g, "_");
    // Remove = at the end
    hashedValue = hashedValue.replace(/=/g, "");

    return hashedValue;
}

function sha256(value) {
    var hash = Crypto.createHash("sha256");
    hash.update(value, "utf8");
    var hashedValue = hash.digest("hex");
    return hashedValue;
}

function sha256_Hex(value) {
    var hash = Crypto.createHash("sha256");
    hash.update(value, "utf8");
    var hashedValue = hash.digest("hex");
    return hashedValue;
}

function sha256_base64(value) {
    var hash = Crypto.createHash("sha256");
    hash.update(value, "utf8");
    var hashedValue = hash.digest("base64");
    return hashedValue;
}

function md5(value) {
    var hash = Crypto.createHash("md5");
    hash.update(value, "utf8");
    var hashedValue = hash.digest("hex");
    return hashedValue;
}

function hmacSha1Base64(key, value) {
    var hash = Crypto.createHmac("sha1", key).update(value);
    return hash.digest("base64");

}

function hmacSha1Hex(key, value) {
    var hash = Crypto.createHmac("sha1", key).update(value);
    return hash.digest("hex");

}

exports.sha1 = sha1;
exports.sha1_base64 = sha1_base64;
exports.sha1_base64_urlsafe = sha1_base64_urlsafe;
exports.sha256 = sha256;
exports.sha256_Hex = sha256_Hex;
exports.sha256_base64 = sha256_base64;
exports.md5 = md5;
exports.hmacSha1Base64 = hmacSha1Base64;
exports.hmacSha1Hex = hmacSha1Hex;
