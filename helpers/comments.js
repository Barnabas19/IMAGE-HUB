var Models = require('../models');
var async = require('async');

module.exports = {
    newest: function(callback){
        Models.Comment.find({}, {}, {limit: 5, sort: {'timestamp': -1}}, //GET HOLD OF THE MOST RECENT COMMENTS IN THE DATABASE (COMMENTS COLLECTION SPECIFICALLY)
        function(err, comments){
            var attachImage = function(comment, next){
                Models.Image.findOne(  //FIND THE IMAGE CORRESPONDING TO A GIVEN COMMENT
                    {_id: comment.image_id},
                    function(err, image){
                        if(err){
                            throw err;
                        }
                        comment.image = image;  //ATTACH THE FOUND IMAGE (OBJECT) TO THE 'image' VIRTUAL PROPERTY OF THE 'comment' MODEL
                        next(err);
                    }
                );
            }
            /*
            'async.each' calls 'attachImage' on each item in the 'comments' array(or collection)
            'attachImage' takes in each item, accesses its data for an operation and invokes next() so that
            it would run on the next item on the array
            */
            async.each(
                comments, attachImage,
                function(err){  //THIS INLINE FUNCTION WOULD RUN ONCE 'attachImage' has been successfully called on each item of the 'comments' array
                    if(err){
                        throw err;
                    }
                    callback(err, comments);  //THIS CALLBACK EXECUTION IS THE EXECUTION OF 'next' LOCATED IN './sidebar.js' ON LINE 16
                }
            )
        });
    }
};