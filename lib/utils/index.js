// Utils are usually project independent they possess
// Utils functions that can be consumed by any layer

var Fs = require("fs");
var Path = require("path");

module.exports = function() {
    var _fns = {};
    Fs.readdirSync(__dirname).forEach(function(file) {
        if (file === "index.js"){
            return;
        }

        //var filepath = Path.resolve(Path.join(__dirname, file));
        var ext = Path.extname(file);
        var basename = Path.basename(file, ext);

        _fns[basename] = require("./" + file);
    });

    return _fns;
};

