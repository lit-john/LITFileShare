var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require ('fs');

var routes = require('./routes/index');

var app = express();

var multer = require('multer');


/* 
 *    Setting up the storage method.
 */
var storageMethod = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("In destination");
        
        fs.exists('./uploads/', function(exists){
            if (!exists) {
                fs.mkdir('./uploads/', function(error) {
                    cb(error, './uploads/');
                })
            }
            else {
                cb(null, './uploads/');
            }
        })
        
        
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Requests for /<anything> are going to be routed through
 * the multer middlerware (which we set up using the storage 
 * method we defined above). The .any() means we are happy to
 * accept file uploads from any file input fields (as opposed
 * to naming the fields we are happy to accept from). For 
 * more information check out https://github.com/expressjs/multer
 * 
 * It is important that we set up the multer middleware before we
 * ask for all /<anything> requests to be routed to 'routes'.
 */
app.use('/',multer({storage: storageMethod}).any());
app.use('/', routes);


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
