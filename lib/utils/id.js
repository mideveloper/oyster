var dateFormat = global.Packages.dateFormat;
var Hash = require("../utils/hash.js");

function pad(num, size) {
    var s = num + "";
    while (s.length < size) {
        s = "0" + s;
    }
    return s;
}

function generate() {
    var randomnumber = Math.floor(Math.random() * 10000);
    var random4 = pad(randomnumber, 4);
    var currenttime = dateFormat("yymmddhhMMss");
    return parseInt(currenttime + "" + random4);
}

function generateNumber(text) {
    var hashed = Hash.sha1(text);
    return hashed;
}

function generateHash(text) {
    // TODO: Investigate replacing this with fnv1 64-bit for a smaller hash
    // See http://www.tools4noobs.com/online_tools/hash/ to play with different hash algorithms
    var hashed = Hash.sha1_base64_urlsafe(text);
    return hashed;
}

exports.generate = generate;
exports.pad = pad;
exports.generateNumber = generateNumber;
exports.generateHash = generateHash;
