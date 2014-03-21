var Db = require("mongodb").Db,
    Server = require("mongodb").Server,
    Promise = global.Packages.Promise;



function getClient(server, pools, callback) {
    var poolkey = server.host + ":" + server.port;
    var pool = pools[poolkey];

    if (!pool) {
        var db = new Db(server.db, new Server(server.host, server.port, {
            auto_reconnect: true
        }), {
            native_parser: true,
            w: 1
        });

        db.open(function(err, mongoclient) {
            if (err) {
                callback(err);
                return;
            }
            pools[poolkey] = mongoclient;
            callback(err, pools[poolkey]); //return Promise
        });
    }
    else {

        callback(null, pool);
    }

}

function initialize(params) {
    
    var pools = [];
    var server = {
        host: params.host,
        port: params.port,
        db: params.db,
    };
    
    // TODO: Mongo supports sharding and replica logic, we should compline this class to support sharding and read replica
    
    function deleteAllPropertiesWhichAreUndefined(object){
        for(var k in object){
            if(object[k] === undefined){
                delete object[k];
            }
        }

        return object;
    }
    
    function extend(attributes) {

        if (!attributes.tableName) {
            throw new Error("tableName must be defined");
        }
        function saveData(context, input) {


            return new Promise(function (resolve, reject) {
                getClient(server, pools, function (err, client) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    client.collection(context.tableName).save(context.getMongoDataObject(input), function (err, output) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(output);
                        return;
                    });
                });
            });
        }
        function getArrayQuery(context, data) {
            var query_obj = {};
            data = deleteAllPropertiesWhichAreUndefined(context.getMongoDataObject(data));

            for (var property in data) {
                if (data[property] instanceof Array) {
                    query_obj[property] = { $each: data[property] };
                }
                else {
                    query_obj[property] = data[property];
                }
            }

            return query_obj;
        }

        function Model(obj) {

            //if model creation is not with new keyword then return it with new 
            if (!(this instanceof Model)) {
                return new Model(obj);
            }

            this.tableName = attributes.tableName;

            if (attributes.idAttribute) {
                obj._id = obj[attributes.idAttribute];
                obj[attributes.idAttribute] = undefined;
            }

            this.input = obj;
        }

        Model.prototype.update = function update(where_clause, set_fields) {
            var self = this;
            return new Promise(function(resolve, reject) {
                getClient(server, pools,function(err, client) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    client.collection(self.tableName).update(where_clause, {
                        $set: set_fields
                    }, function(err, output) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(output);
                        return;
                    });
                });
            });
        };

        Model.prototype.save = function save() {
            var self = this;
            return saveData(self, self.input);
            
        };

        Model.prototype.saveInBatch = function saveInBatch() {
            var self = this;

            var promises = [];

            for (var index = 0; index < self.input.length; index++) {
                promises.push(saveData(self, self.input[index]));
            }

            return Promise.all(promises).spread(function () { return true; });
            
        };

        Model.prototype.fetch = function fetch(select_clause) {
            var self = this;
            if (!select_clause) {
                select_clause = {};
            }

            return new Promise(function(resolve, reject) {
                getClient(server, pools, function(err, client) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    //  deleting all properties which are undefined because otherwise mongo will make them part of query that results
                    //  inappropriate data 
                    var mongo_obj = deleteAllPropertiesWhichAreUndefined(self.getMongoDataObject(self.input));

                    client.collection(self.tableName).find(
                        mongo_obj, select_clause, {
                        limit: 1
                    }).toArray(function(err, output) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (output.length > 0) {
                            resolve(self.getObjectFromMongoDataObject(output.shift()));
                            return;
                        }
                        else {
                            resolve(null);
                            return;
                        }
                    });
                });
            });
        };

        Model.prototype.getInBatch = function getInBatch(select_clause) {
            var self = this;
            if (!select_clause) {
                select_clause = {};
            }
            return new Promise(function(resolve, reject) {
                getClient(server, pools, function(err, client) {
                    if (err) {
                        reject(err);
                        return;
                    }


                    client.collection(self.tableName).find({
                        _id: {
                            $in: self.input
                        }
                    }, select_clause, {
                        limit: self.input.length
                    }).toArray(function(err, output) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        var result = [];

                        while (output.length > 0) {
                            result.push(self.getObjectFromMongoDataObject(output.shift()));
                        }
                        resolve(result);
                        return;
                    });
                });
            });
        };

        Model.prototype.find = function find(criteria, select_clause, projection) {
            var self = this;
            return new Promise(function(resolve, reject) {
                getClient(server, pools, function(err, client) {
                    if (err) {
                        reject(err);
                        return;
                    }


                    client.collection(self.tableName).find(criteria, select_clause, projection).toArray(function(err, output) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        var result = [];

                        while (output.length > 0) {
                            result.push(self.getObjectFromMongoDataObject(output.shift()));
                        }
                        resolve(result);
                        return;
                    });
                });
            });
        };

        Model.prototype.appendArrayItemsIfNotExist = function appendArrayItemsIfNotExist(where_clause) {
            var self = this;

            return new Promise(function (resolve, reject) {
                getClient(server, pools, function (err, client) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    client.collection(self.tableName).update(
                        self.getMongoDataObject(where_clause),
                        { $addToSet: getArrayQuery(self, self.input) }, function (err, output) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(output);
                            return;
                        });
                });
            });
        };

        Model.prototype.appendArrayItems = function appednArrayItems(where_clause) {
            var self = this;

            return new Promise(function (resolve, reject) {
                getClient(server, pools, function (err, client) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    client.collection(self.tableName).update(
                        self.getMongoDataObject(where_clause),
                        { $push: getArrayQuery(self, self.input) }, function (err, output) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(output);
                            return;
                        });
                });
            });
        };

        Model.prototype.getMongoDataObject = function getMongoDataObject(obj) {
            return obj;
        };

        Model.prototype.getObjectFromMongoDataObject = function getObjectFromMongoDataObject(obj) {
            return obj;
        };

        Model.prototype.deleteAll = function deleteAll() {
            var self = this;
            return new Promise(function (resolve, reject) {
                getClient(server, pools, function (err, client) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    client.collection(self.tableName).remove(err, function (err, output) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(output);
                            return;
                        });

                });
            });
        }

        return Model;
    }
    
    return {
        extend: extend
        
    };
}

module.exports.initialize = initialize;

