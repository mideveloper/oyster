var Epoch = require("../utils/epoch"),
_ = global.Packages.lodash;

var model = require("./db").Model.extend({
        tableName: "location"
    });

/* ********************  PRIVATE FUNCTIONS  ***************************** */
function getTopProfileItemCounts(counts, max_items_count){
    
    var allKeys = Object.keys(counts);
    
    if(allKeys.length === 0){
        return null;
    }
    
    if(max_items_count > allKeys.length){
        max_items_count = allKeys.length;
    }
    
    var cItem = {};
    cItem.profile_item_id = allKeys[0];
    cItem.count = counts[allKeys[0]];
    
    var top_counts = [];
    top_counts.push(cItem);
    
    function fillItemsUpToMaxLimitInSortedOrderDesc(){
        for(var i = 1; i < max_items_count ; i++){
            cItem = {};
            cItem.profile_item_id = allKeys[i];
            cItem.count = counts[allKeys[i]];
            
            for(var j = 0; j < i; j++){
                
                if(top_counts[j].count < cItem.count ){
                    top_counts.splice(j,0,cItem);
                    break;
                }
                else if (j === (i-1)){
                    top_counts.push(cItem);
                    break;
                }
            }
        }
    }
    
    fillItemsUpToMaxLimitInSortedOrderDesc();
    
    var topCountItemVal = top_counts[0].count;
    
    for(var index = max_items_count; index < allKeys.length; index++){
        
        var sItem = {};
        sItem.profile_item_id = allKeys[index];
        sItem.count = counts[allKeys[index]];
        
        if(sItem.count >= topCountItemVal){
            top_counts.unshift(sItem);
            top_counts.pop();
            topCountItemVal = sItem.count;
        }
    }
    
    return top_counts;
    
}

// overriding base method    
model.prototype.getMongoDataObject = function getMongoDataObject(object){
    
    // prepare mongo specific object from user given object
    return {
        _id : object.user_id,
        location : { type: "Point", coordinates: [ object.lon, object.lat ] },
        //profile_items : [ "abc", "cde", "rde"],
        profile_items : object.profile_items,
        location_updated_on :  Epoch.now()
    };
};

model.prototype.getObjectFromMongoDataObject = function getObjectFromMongoDataObject(mongoObject){
    // return user specific object from mongo object
    if(mongoObject.location){
        mongoObject.lon = mongoObject.location.coordinates[0];
        mongoObject.lat = mongoObject.location.coordinates[1];
        delete mongoObject.location;
    }
    
    
    return mongoObject;
};

model.prototype.updateLocation = function updateLocation(){
    var self = this;
    
    var mongo_object = self.getMongoDataObject(self.input);
    
    return self.update( { _id: mongo_object._id }, { location : mongo_object.location }).then(function(){
        return;
    });
                    
};

model.prototype.getCount = function getCount() {

    var self = this;

    return self.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(self.input.lon), parseFloat(self.input.lat)]
                }
            }
        }
    }, {
        // select clause
        _id: 1,
        profile_items:1,
        
    }, {
        limit: 1000,
        hint: {
            location: "2dsphere"
        }
    }).then(function(output) {
       
        var profile_items = [];
        // concat all users profile items
        for(var index=0; index < output.length; index++){
            
            if(output[index].profile_items){
                profile_items = profile_items.concat(output[index].profile_items);
            }
        }
        
        // get count by profile items to identify trends
        var counts = _.countBy(profile_items);
        counts = getTopProfileItemCounts(counts, 10); // getting top 10 most occuring profile items 
        
        return {
            trend_counts : counts,
            everyone : output.length
        };
    });
};

model.prototype.getList = function getList(){
    var self = this;
    var query;
    if(self.base.trend === "everyone" || !self.base.trend){
        query = {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(self.input.lon), parseFloat(self.input.lat)]
                    }
                }
            },
            profile_items: self.input.trend
        };
    }
    else{
        query = {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(self.input.lon), parseFloat(self.input.lat)]
                    }
                }
            }
        };
    }
    
    return self.find(
        query, {
        // select clause
        _id: 1,
        profile_items:1,
        location:1
    }, {
        limit: 20,
        hint: {
            location: "2dsphere"
        }
    }).then(function(output) {
        return output;
    });
};

/*function addProfileItems(user_id, profile_items){
    
}

function removeProfileItems(user_id, profile_items){
    
}*/

module.exports = model;
