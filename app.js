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
var CrewUser = require('./models/crewuser');

const passport = require('passport');
const authenticate = require('./authenticate');
var cron = require('node-cron');
const crewuser = require('./models/crewuser');
const nodemailer = require('nodemailer');
const email = require('./email');
const logo = 'https://firebasestorage.googleapis.com/v0/b/crewcoin-3d719.appspot.com/o/crewcoinlogo.png?alt=media&token=04d9cef4-abb6-4579-a14c-eacc3d7c2983';
const gif = 'https://firebasestorage.googleapis.com/v0/b/crewcoin-3d719.appspot.com/o/coinIconSmall.gif?alt=media&token=4d227f37-88e7-4645-9dd1-7d806ed7307e';
const transporter = nodemailer.createTransport({
  service: "Office365",
  host: "smtp.office365.com",
  secureConnection: false,
  port: 25,
  auth: {
    user: config.auth.user,
    pass: config.auth.pass
  },
  tls: {
    rejectUnauthorized: false
  }
});

///allow users to schedule coin increases monthly
// cron.schedule('0 0 1 * *', () => {
//   CrewUser.find({ budget: true })
//     .then(users => {
//       users.forEach(user => {
//         user.balance += user.budgetAmount;
//         user.save();
//         const message = "Cha Ching! <br> Your monthly balance has been increased by " + user.budgetAmount + " Crew Coins! <br> Spend them wisely!";
//         const mailDataPassChange = {
//           from: 'admin@crew-coin.com',  // sender address
//           to: user.username,   // list of receivers
//           subject: 'Cha Ching! New Balance!', // Subject line
//           text: `New Balance!`, // plain text body
//           html: email.password(user.firstname, message, logo, gif) // html body
//         };
//         transporter.sendMail(mailDataPassChange, function (err, info) {
//           if (err)
//             console.log(err)
//           else
//             console.log(info);
//         });
//       })
//     })
//     .catch(err => console.log(err));
// });


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
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
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
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
