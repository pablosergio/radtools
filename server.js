/**
 * Created by Sergio on 10/12/2016.
 */
// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express

/* Handelrs (Controllers en MVC) */

var loginHandler = require('./handlers/loginHandler');
var listaHandler = require('./handlers/listaHandler');
var postgresHandler = require('./handlers/postgresHandler');
var fileHandler = require('./handlers/fileHandler');
var applicationHandler = require('./handlers/applicationHandler');

var routes = require('./routes');
var bodyParser = require('body-parser');
var cors = require('cors');
var expressValidator = require('express-validator');
var expressWinston = require('express-winston');
var winston = require('winston');
var cfg = require("config")
dotenv = require('dotenv');

var port = process.env.PORT || 8081;        // set our port
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8081/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to node js rest service!' });
});

/* cambiar el path cuando se necesite pasar a produccion */
dotenv.config({
    path: './config/env/.development'
});

dotenv.load();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.Router());
app.use(cors());


// REGISTER BASE ROUTES -------------------------------
// all of our routes will be prefixed with /common
app.use('/api', router);

//Define route handlers
var handlers = {
    login: new loginHandler(),
    lista: new listaHandler(),
    postgres: new postgresHandler(),
    files: new fileHandler(),
    application: new applicationHandler()
};

function start() {
    routes.setup(router, handlers);
    // express-winston errorLogger makes sense AFTER the router.
    app.use(expressWinston.errorLogger({
        transports: [
            new winston.transports.File({
                level: 'error',
                filename: __dirname + '/' + cfg.get("COMMON.log.logsDirectory") + '/' + cfg.get("COMMON.log.fileName"),
                handleExceptions: true,
                json: true,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false,
                timestamp:true
            }),
            new winston.transports.Console({
                json: true,
                colorize: true
            })
        ]
    }));

    if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
        app.use(errorhandler());
    }else if(process.env.NODE_ENV === 'production'){
        app.use(compress());
    }

    app.listen(port);
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}

exports.start = start;
