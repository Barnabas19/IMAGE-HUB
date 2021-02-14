var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;  //Schema.ObjectId returns a type which holds MONGO DB id's

var CommentSchema = new Schema({
    image_id: {type: ObjectId},
    email: {type: String},
    name: {type: String},
    gravatar: {type: String},
    comment: {type: String},
    timestamp: {type: Date, 'default': Date.now()}
})

CommentSchema.virtual('image').set(function(image){
    this._image = image;
}).get(function(){
    return this._image
})

module.exports = mongoose.model('Comment', CommentSchema); //AT THIS POINT, MONGO DB WILL CREATE A COLLECTION NAMED: 'Comments' FASHIONED IN THE LIKENESS OF 'CommentSchema'