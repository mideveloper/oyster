// models will contain data dependent classes

var mongo = require("./mongo"),
mysql = require("./mysql"),
pg = require ("./pg"),
sqlite = require("./sqlite");

function initialize(params){
    
    if(!params){
        throw new Error ("params must be defined");
    }
    
    if(!params.client){
        throw new Error ("client property must be defined");
    }
    
    if(params.client === "mysql"){
        return mysql.initialize(params);
    }
    else if (params.client === "pg"){
        return pg.initialize(params);
    }
    else if (params.client === "sqlite"){
        return sqlite.initialize(params);
    }
    else if (params.client === "mongo"){
        return mongo.initialize(params);
    }
    else{
        throw new Error("client must be \"mysql, pg, sqlite or mongo\"");
    }
}

module.exports.initialize = initialize;
