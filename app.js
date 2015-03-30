var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');

var mongoose = require('mongoose');

// Express Session allows us to use Cookies to keep track of
// a user across multiple pages. We also need to be able to load
// those cookies using the cookie parser
var session = require('express-session');
var cookieParser = require('cookie-parser');

// Flash allows us to store quick one-time-use messages
// between views that are removed once they are used.
// Useful for error messages.
// var flash = require('connect-flash');

// Load in the base passport library so we can inject its hooks
// into express middleware.
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Load in our passport configuration that decides how passport
// actually runs and authenticates
var passportConfig = require('./config/passport');


// var authenticationController = require('./routes/authentication');



var routes = require('./routes/index');
var users = require('./routes/users');
var initialPost = require('./routes/initialPost');
var directions = require('./routes/directions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Add in the cookieParser and flash middleware so we can
// use them later
app.use(cookieParser());
// app.use(flash());

// Initialize the express session. Needs to be given a secret property.
// Also requires the resave option (will not force a resave of session if not modified)
// as well as saveUninitialized(will not automatically create empty data)
// app.use(session({
    // secret: 'secret',
    // resave: false,
    // saveUninitialized: false
// }));

// Hook in passport to the middleware chain
// app.use(passport.initialize());

// Hook in the passport session management into the middleware chain.
// app.use(passport.session());


// Our get request for viewing the login page
// app.get('/auth/login', authenticationController.login);

// Post received from submitting the login form
// app.post('/auth/login', authenticationController.processLogin);

// Post received from submitting the signup form
// app.post('/auth/signup', authenticationController.processSignup);

// Any requests to log out can be handled at this url
// app.get('/auth/logout', authenticationController.logout);

// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()
// app.use(passportConfig.ensureAuthenticated);

app.use('/', routes);
app.use('/directions', directions);
app.use('/initialPost', initialPost);
app.use('/users', users);

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect('mongodb://localhost/aimless_test');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
