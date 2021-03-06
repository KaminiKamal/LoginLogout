var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');//managing sessions
var mailer = require('express-mailer');
var cors = require('cors');
// var helmet = require('helmet');

var config = require('./config')[process.env.NPM_CONFIG_PRODUCTION || 'development'];

var routes = require('./routes/web/index');
// var users = require('./routes/users');

var app = express();

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// For Prod usage (SECURITY)
// app.use(helmet())
/*
mailer.extend(app, {
  from: config.email.from,
  host: config.email.host, // hostname
  secureConnection: true, // use SSL
  port: config.email.port, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass
  }
});
*/
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: config.secret,
  resave: false,
  cookie: { secure: false },
  saveUninitialized: true
}));

app.use('/', routes);
// app.use('/users', users);

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
