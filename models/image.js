var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var path = require('path');

var ImageSchema = new Schema({
    title: {type: String},
    description: {type: String},
    filename: {type: String},
    views: {type: Number, 'default': 0},
    likes: {type: Number, 'default': 0},
    timestamp: {type: Date, 'default': Date.now()}
});

ImageSchema.virtual('uniqueId')  //VIRTUAL PROPERTIES ARE PROPERTIES THAT YOU DON'T GET TO SET YOURSELF IN YOUR CODE...IT IS AUTOMATICALLY SET (ACCORDING TO THE get() AND set() FUNCTIONS) BY MONGO DB...WHEN YOU CREATE A RECORD
.get(function(){
    return this.filename.replace(path.extname(this.filename), '');
});

module.exports = mongoose.model('Image', ImageSchema);