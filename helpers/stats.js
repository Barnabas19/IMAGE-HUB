var Models = require('../models');
var async = require('async');

module.exports = function(callback){
    async.parallel(
        [
            function(next){
                Models.Image.count({}, next);  /* NOTE:  IT IS ALWAYS IMPORTANT YOU CALL 'next' AS THAT IS HOW ASYNC MODULE GETS HOLD OF THINGS
                'next' WILL TAKE IN ERROR OBJECT AS FIRST PARAMETER AND THE TOTAL COUNT AS THE SECOND PARAMETER, WHEN IT IS BEING EXECUTED ASYNCHRONOUSLY
                'next' ALSO SEEMS TO BE THE "LINK" THROUGH WHICH THE RESULTS ARE AVAILABLE TO THE INLINE FUNCTION USED AS A SECOND PARAMETER TO THE 'parallel' FUNCTION OF THE ASYNC MODULE*/
            },
            function(next){
                Models.Comment.count({}, next);
            },
            function(next){
                Models.Image.aggregate(
                    [{
                        $group: {
                            _id: '1',
                            viewsTotal: {
                                $sum: '$views'
                            }
                        }
                    }], //THE 'aggregate' FUNCTION GROUPS EVERY DOCUMENT TOGETHER AND SUMS UP ALL OF THEIR VIEWS
                    //INTO A SINGLE NEW FIELD CALLED 'viewsTotal'
                    function(err, result){  //THE 'result' PARAMETER HERE IS AN ARRAY OF DOCUMENTS WITH THE '_id' AND 'viewsTotal' PROPERTIES( OR FIELDS)
                                            //IN THIS CASE, THE RESULT ARRAY HOLDS A SINGLE DOCUMENT WITH THE GRAND TOTAL BECAUSE WE WEREN'T THAT TRICKY WITH OUR 'aggregate' FUNCTIONALITY
                        var viewsTotal = 0;
                        if(result.length > 0){
                            viewsTotal += result[0].viewsTotal;
                        }
                        next(null, viewsTotal);
                    }
                );
            },
            function(next){
                Models.Image.aggregate(
                    [{
                        $group: {
                            _id: '1',
                            likesTotal: {
                                $sum: '$likes'
                            }
                        }
                    }],
                    function(err, result){
                        var likesTotal = 0;
                        if(result.length > 0){
                            likesTotal += result[0].likesTotal;
                        }
                        next(null, likesTotal);
                    }
                );
            }
        ],
        function(err, results){
            callback(
                null,
                {
                    images: results[0],
                    comments: results[1],
                    views: results[2],
                    likes: results[3]
                }
            );
        }
    );
}