var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var pugLoader = require('pug-loader');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');
// var img(src=require("./public/images/catalog-banner.png"));

var app = express();
app.set('port', 3000);

var mongodb = 'mongodb://127.0.0.1/tbcatalogue';
mongoose.connect(mongodb);
mongoose.Promise=global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection Error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(pugLoader);

app.use(session({
  key: 'user_sid',
  secret:'bestsecretnosecret',
  resave: false,
  saveUninitialized: false,
  cookie: {expires: 600000}
}));

// Previously logged in user might have might have sent the cookie saved in its browser
// Howeever, the application might have removed user session due to its long inactivity
// Need to request the browser to remove the stale cookie
app.use((req, res, next) => {
  if(req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  else {
    next();
  }
});

var sessionChecker = (req, res, next) => {
  if(req.session.user && req.cookies.user_sid) {
    return next();
  }
  else {
    res.redirect('/users/signin');
  }
};

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', sessionChecker, catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
