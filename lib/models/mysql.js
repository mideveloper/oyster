var Bookshelf = global.Packages.Bookshelf;


function initialize(params) {
    return Bookshelf.initialize({
        client: "mysql",
        connection: {
            host: params.host,
            user: params.uid,
            password: params.pwd,
            database: params.db,
            charset: (params.charset) ? params.charset : "utf8"
        }
    });
}

module.exports.initialize = initialize;


