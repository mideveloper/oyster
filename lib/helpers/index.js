// helpers can be accessed by any layer like utils
// only difference between helpers and utils is, helpers may do some db dependent tasks or application dependent tasks
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

