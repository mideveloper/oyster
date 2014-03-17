var Crypto = require("crypto");
var Promise = global.Packages.Promise;
var SCrypt = global.Packages.SCrypt;
var OUTPUT_ENCODING = "base64";
var IV = "1b34d6a8";
var PASSWORD = "2L3gitTooLe6itT0Qu1t!!H3yh3Y!!";
var MAX_TIME = 1.0;


Promise.promisifyAll(SCrypt);

var make_url_safe = function(text) {
    // Replace + with -
    text = text.replace(/\+/g, "-");
    // Replace \ with _
    text = text.replace(/\//g, "_");
    // Remove = at the end
    text = text.replace(/=/g, "~");

    return text;
};

var make_url_unsafe = function(text) {
    // Replace - with +
    text = text.replace(/-/g, "+");
    // Replace _ with \
    text = text.replace(/_/g, "/");
    //Replace ~ with =
    text = text.replace(/~/g, "=");

    return text;
};

module.exports.encrypt = function(text, encoding) {
    // Note, it's up to the consumer to know if they've encoded with something other than
    // the default and then apply it on the decrypt.
    encoding = encoding || OUTPUT_ENCODING;

    var cipher = Crypto.createCipheriv("blowfish", PASSWORD, IV);
    var encryptedText = cipher.update(text.toString(), "utf8", encoding);
    encryptedText += cipher.final(encoding);
    encryptedText = make_url_safe(encryptedText);
    return encryptedText;
};

module.exports.decrypt = function(encryptedText, encoding) {
    encoding = encoding || OUTPUT_ENCODING;

    encryptedText = make_url_unsafe(encryptedText);
    var decipher = Crypto.createDecipheriv("blowfish", PASSWORD, IV);
    var text = decipher.update(encryptedText, encoding, "utf8");
    text += decipher.final("utf8");
    return text;
};



// Asynchronous encryption, turns message into cipher
module.exports.super_encrypt = function(message) {

    // Return a promise that the consumer can decide to use or ignore
    return SCrypt.encryptAsync(message, PASSWORD, MAX_TIME).then(function(cipher) {
        return make_url_safe(cipher);
    }).
    catch (function(err) {
        throw new Error(err);
    });
};

// Asynchronous decryption, turns cipher into message
module.exports.super_decrypt = function(cipher) {

    cipher = make_url_unsafe(cipher);
    // Return a promise that the consumer can decide to use or ignore
    return SCrypt.decryptAsync(cipher, PASSWORD, MAX_TIME).then(function(message) {
        return message[0];
    }).
    catch (function(err) {
        throw new Error(err);
    });
};
