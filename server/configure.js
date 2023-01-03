var path = require('path');
var routes = require('./routes');
var exphbs = require('express-handlebars');
var express = require('express'); //api framework
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var moment = require('moment');
var multer = require('multer');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var Handlebars = require('handlebars');

module.exports = function(app){
    app.use(morgan('dev')); //responsible for logging, helps in debugging
    app.use(bodyParser.urlencoded({'extended': true})); //makes a submitted HTML form available in req.body
    app.use(bodyParser.json()) //sequel
    app.use(multer({ dest: path.join(__dirname, 'public/upload/temp')}).single('file'));
    app.use(methodOverride());  //for older browsers that don't support REST HTTP verbs 
    app.use(cookieParser('some-secret-value-here'));  //allows cookies to be sent and received
    routes(app);  //attaching routes to app instance via express.Router() router variable in routes.js
    app.use('/public', express.static(path.join(__dirname, '../public'))); //render static content files in public folder

    if('development' === app.get('env')){
        app.use(errorHandler()); //handle all errors...finale
    }
    app.engine('handlebars', exphbs.create({
        defaultLayout: 'main',  //layout view...containing (global) header, footer, etc
        layoutsDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials'],
        helpers: {    //defining global helper functions so that any handlebars template can access and use it
            timeago: function(timestamp){
                return moment(timestamp).startOf('minute').fromNow();  //moment is a date string formatting npm-module
            }
        },
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    }).engine);
    app.set('view engine', 'handlebars');
    
    return app;
};