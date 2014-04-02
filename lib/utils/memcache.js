var Promise = global.Packages.Promise,
Hold = global.Packages.Hold,
Memcached = global.Packages.Memcached;

var _cacheClient, _defaultExpiryInSeconds = 60 * 60;

var issue = function(details){
    global.Logger.error(JSON.stringify(details));
   
};

var failure = function(details){
    global.Logger.error(JSON.stringify(details));
    
};

var reconnecting = function(details){
    global.Logger.error(JSON.stringify(details));
    
};

var getCacheClient = function(ctx) {
    
    var needstoreload = false;
	
	if (!_cacheClient) {
		needstoreload = true;
	}
	
	if (needstoreload) {
		
		return ctx.getServers(function(servers) {

				if (_cacheClient) {
					_cacheClient.end();
				}
				var memcached_servers = [];
				for(var index = 0; index < servers.length; index++){
				    console.log(servers[index].server);
				    memcached_servers.push(servers[index].server + ":" + servers[index].port);
				}
			    
				_cacheClient = new Memcached(servers);
				_cacheClient.setMaxListeners(0);
			    return _cacheClient;
			
		});
	} else {
		return new Promise(function(resolve){
		    resolve(_cacheClient);
		    return;
		});
	}
};

function MemCache(){
    
}

MemCache.prototype.getServers = function getServers(){
    return new Promise(function (resolve){
        return resolve([
            {
                server : "localhost",
                port : 11211
        }]);
    });
};

function setValue(cache_client,key, value, callback){
    cache_client.set(key, value, function(err){
        if(err){
            callback(err);
            return;
        }
        callback(null);
        return;
    });
}

function getValue(cache_client,key, callback){
    cache_client.get(key, function(err, val){
        if(err){
            callback(err, null);
            return;
        }
        callback(null, val);
        return;
    });
}

MemCache.prototype.set = function set(key, value, expiry_in_seconds){
    var self = this;
    expiry_in_seconds = (expiry_in_seconds && expiry_in_seconds > 0) ? expiry_in_seconds : _defaultExpiryInSeconds;
   return getCacheClient(self).then(function(cache) {
        console.log(cache);
		return Promise.promisify(setValue)(cache, key, value, _defaultExpiryInSeconds).then(function(){
			return;
		});		    
		
	}).then(function(){
	    return;
	});
};

MemCache.prototype.get = function get(key) {
    var self = this;
	return getCacheClient(self).then(function(cache) {

		return Promise.promisify(getValue)(cache, key).then(function(value){
			if(value === false) {
			    return null;        
			}
			else{
			    return value;
			}
		});		    
		
	}).then(function(val){
	    return val;
	});
	
};

MemCache.prototype.remove = function remove(key){
      var self = this;
	return getCacheClient(self).then(function(cache) {
		return Promise.promisify(cache.del)(key).then(function(){
			return;
		});		    
		
	}).then(function(){
	    return;
	});
	
};

module.exports = MemCache;

