var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./model/db');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var userObj = require('./model/User');
var itemObj = require('./model/Item');
var followingObj = require('./model/Item');
var followsObj = require('./model/Following');
var followsObj = require('./model/Follows');
var MediaObj = require('./model/Media');
var pass_cofig = require('./config/passport.js');
require('./routes/TweetService.js')();
require('./routes/UserService.js')();
var index = require('./routes/index');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(logger('dev')); // COMMENT THIS OUT FOR THE SCRIPT!!!!!!!

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());

// app.use(session({
//     secret: 'secretCrap',
//     saveUninitialized: true,
//     resave: true
// }));

app.use(session({
     secret: 'secret',
     store: new MongoStore( {mongooseConnection: mongoose.connection}),
     resave: false,
     saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render(err.message);
});

module.exports = app;
