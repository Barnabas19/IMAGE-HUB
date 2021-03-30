var express = require('express');
var config = require('./server/configure');
var mongoose = require('mongoose');
var app = express();

app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app = config(app);

//CONNECTING TO THE MONGODB SERVER
mongoose.connect(process.env.DB_URL);
mongoose.connection.on('open', function(){
    console.log('Mongoose connected.');
});

/*
app.get('/', function(req, res){
    res.send('Hello World');
});*/
app.listen(app.get('port'), function(){
    console.log(`Server is listening on http://localhost:${app.get('port')}`);
});