// models will contain data dependent classes
var DB = require("./db"),
Epoch = require("../utils/epoch");

// this model contains User specific data, it contains every association of user in it except location
var model = DB.Model.extend({
    tableName: "user",
});

// overriding base method    
model.prototype.getMongoDataObject = function getMongoDataObject(object){
    
    // prepare mongo specific object from user given object
    return {
        _id : parseInt(object.user_id),
        device_id : object.device_id,
        device_type: object.type,
        first_name : object.first_name,
        last_name : object.last_name,
        updated_on : Epoch.now(),
        is_active : object.is_active,
        profile_items : object.profile_items,
        friends : object.friends,
        profile_photo : object.profile_photo,
        is_logged_in : object.is_logged_in
    };
};

model.prototype.getObjectFromMongoDataObject = function getObjectFromMongoDataObject(mongoObject){
    // return user specific object from mongo object
    mongoObject.user_id = mongoObject._id;
    delete mongoObject._id;
    return mongoObject;
};

/*function addFriend(user_id, friend){
    
}

function removeFriend(user_id, friend){
    
}

function addPhotos (user_id, photos){
    
}

function removePhotos(user_id, photos){
    
}

function addProfileItems(user_id, profile_items){
    
}

function removeProfileItems(user_id, profile_items){
    
}*/

module.exports = model;