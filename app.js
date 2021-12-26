var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const config = require('./config');
const cors = require('cors');
const mongoose = require('mongoose');
const url = config.mongoUrl;
var indexRouter = require('./routes/index');
var storeRouter = require('./routes/storeRouter');
var announcementsRouter = require('./routes/announcementsRouter');
var crewUserRouter = require('./routes/crewUserRouter');

const passport = require('passport');
const authenticate = require('./authenticate');

const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var app = express();

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    //may need to delete the line below
    allowedHeaders: ['*'],
  })
);


app.use('/', indexRouter);
app.use('/store', storeRouter);
app.use('/crewuser', crewUserRouter);
app.use('/announcements', announcementsRouter);


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
