// configuracao herdada do xduka
if (process.env.NODE_ENV === 'production'){
    require('newrelic');
}

var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();



// configuration ===============================================================
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

//log + parsers
app.use(logger('dev'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({limit: '50mb'}));

//servindo a documentacao da api
app.use('/docs', express.static(__dirname + '/public/apidoc'));

// required for passport
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());


//rota padrão do home da api
require('./routes/home')(app, passport);
// routes v1 ======================================================================
// load our routes and pass in our app and fully configured passport
require('./routes/v1/clientRoutes')(app, passport);
require('./routes/v1/employeeRoutes')(app, passport);
require('./routes/v1/permLoginRoutes')(app, passport);
require('./routes/v1/studentRoutes')(app, passport);
require('./routes/v1/supplierRoutes')(app, passport);
require('./routes/v1/unitRoutes')(app, passport);
require('./routes/v1/userRoutes')(app, passport);


app.use(function (err, req, res, next) {
    res.status(err.status || 404);
    console.log(err.stack);
    res.json({
        err: err.message,
        fields : []
    });
});


app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.stack);
    res.json({
        err : err.message,
        fields : []
    });
});





module.exports = app;

