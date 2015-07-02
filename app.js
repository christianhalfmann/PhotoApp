var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var indexRoutes = require('./routes/index');
var apiRoutes = require('./routes/apiRoutes');

var app = express();
var port = 60127;

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'anotherPublic'))); // TODO change back to 'public'

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var server = http.createServer(app);
server.listen(port, function() {
    console.log('> Server listening on port: ' + port);
});

process.on('uncaughtException', function (err) {
    console.log(err);
});
