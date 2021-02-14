var Models = require('../models');

module.exports = {
    popular: function(callback){
        Models.Image.find(
            {}, {}, {limit: 9, sort: {likes: -1}},  //SORT BASED ON HIGHEST LIKES TO LOWEST LIKES...DESCENDING ORDER...PULL OUT 9 OF THE HIGHESTS
            function(err, images){
                if(err){
                    throw err;
                }
                callback(null, images);  //this callback execution is the excution of 'next' function in './sidebar.js' on line 13
            }
        );
    }
}