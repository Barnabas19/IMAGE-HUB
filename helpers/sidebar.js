var Stats = require('./stats');
var Images = require('./images');
var Comments = require('./comments');
var async = require('async');

module.exports = function(viewModel, callback){
    async.parallel( //ALL THESE FUNCTIONS IN THE ARRAY ARGUMENT ARE BEING EXECUTED AT THE SAME TIME - IN PARALLEL AS THE NAME IMPLIES
        [
            function(next){
                Stats(next);   //next() takes in: error object as first parameter, and result returned as second parameter.
            },
            function(next){
                Images.popular(next);
            },
            function(next){
                Comments.newest(next);  /* SINCE 'Comments.newest()' IS ASYNCHRONOUS (AND USES THE ASYNC MODULE)
                THE 'next' CALLBACK FUNCTION IS DEFERRED UNTIL THE 'Comments.newest()' FINISHES ITS WORK 
                ONCE THE 'next' CALLBACK FUNCTION IS CALLED, IT IS PASSED THE RESULTS OF 'Comments.newest()' WORK, AS A SECOND PARAMETER. ERROR OBJECT WILL BE THE FIRST PARAMETER*/
            }
        ],
        function(err, results){ //THIS 'results' WILL HOLD THE ARRAY OF RESULTS THAT WERE RETURNED FROM EACH OF THE FUNCTIONS IN THE ARRAY IN THE FIRST PARAMETER
            viewModel.sidebar = {
                stats: results[0],  //RESULT OF THE FIRST FUNCTION
                popular: results[1], //RESULT OF THE SECOND FUNCTION
                comments: results[2]  //RESULT OF THE THIRD FUNCTION
            }
            callback(viewModel);
        }
    );
}