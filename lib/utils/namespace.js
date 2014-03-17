var Fs = require("fs");
var Path = require("path");

// returns an object with all files in folder as class names
function loadClasses(dirName, folderPath) {

    var fns = {};
    var folder = Path.resolve(Path.join(dirName, folderPath));
    Fs.readdirSync(folder).forEach(function(file) {

        var filepath = Path.resolve(Path.join(folder, file));
        var ext = Path.extname(file);
        var basename = Path.basename(file, ext);

        fns[basename] = require(filepath);
    });

    return fns;
}

// runs the init of all files in folder
function loadRoutes(dirName, folderPath, obj) {

    var folder = Path.resolve(Path.join(dirName, folderPath));
    Fs.readdirSync(folder).forEach(function(file) {

        if (file.substr(file.lastIndexOf(".") + 1) !== "js") {
            return;
        }

        var fpath = Path.resolve(Path.join(folder, file));
        require(fpath)(obj);
    });
}

exports.loadClasses = loadClasses;
exports.loadRoutes = loadRoutes;