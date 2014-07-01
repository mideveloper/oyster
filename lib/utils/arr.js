function shuffle(arr){
    
    var current_index = arr.length;
    
    while(current_index > 0){
        
        // Math.random gives random number between 0 and 1
        var random_index = Math.floor(Math.random() * current_index);
        var temp = arr[current_index];
        
        arr[current_index] = arr[random_index];
        arr[random_index] = temp;
        
        current_index--;
        
    }
    
    return arr;
}

module.exports = {
    shuffle: shuffle
};