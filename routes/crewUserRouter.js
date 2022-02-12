const express = require('express');
const CrewUser = require('../models/crewuser');
const passport = require('passport');
const crewUserRouter = express.Router();
const authenticate = require('../authenticate');
const nodemailer = require('nodemailer');
const config = require('../config');


function coin(cost) {
  if (cost > 1) {
    return (
      `${cost} Crew Coins`
    )
  } else {
    return (
      `${cost} Crew Coin`
    )
  }
}

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

/* GET users listing. */

crewUserRouter.route('/:portalId')
  .options((req, res) => { res.sendStatus(200); })
  .get(function (req, res, next) {
    CrewUser.find({ portalId: req.params.portalId })
      .then((crewuser) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.json(crewuser);
      })
      .catch(err => next(err));
  });

crewUserRouter.route('/reload/:_id')
  .options((req, res) => { res.sendStatus(200); })
  .get(function (req, res, next) {
    CrewUser.find({ _id: req.params._id })
      .then((crewuser) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.json(crewuser);
      })
      .catch(err => next(err));
  });

crewUserRouter.route(`/signup`)
  .options((req, res) => { res.sendStatus(200); })
  .post((req, res) => {
    const mailData = {
      from: 'admin@crew-coin.com',  // sender address
      to: req.body.username,   // list of receivers
      subject: 'Welcome to Crew Coin', // Subject line
      text: `Welcome to Crew Coin, ${req.body.firstname}!`, // plain text body
      html: 'Embedded image: <img src="cid:unique@crew-coin.com"/>',
      html: 'Embedded image: <img src="cid:uniquegif@crew-coin.com"/>',
      attachments: [{
        filename: 'crewcoinlogo.png',
        path: 'https://firebasestorage.googleapis.com/v0/b/crewcoin-3d719.appspot.com/o/crewcoinlogo.png?alt=media&token=04d9cef4-abb6-4579-a14c-eacc3d7c2983',
        cid: 'unique@crew-coin.com' //same cid value as in the html img src
      },
      {
        filename: 'coinIconSmall.gif',
        path: 'https://firebasestorage.googleapis.com/v0/b/crewcoin-3d719.appspot.com/o/coinIconSmall.gif?alt=media&token=4d227f37-88e7-4645-9dd1-7d806ed7307e',
        cid: 'uniquegif@crew-coin.com' //same cid value as in the html img src
      }],
      html: `
      <img style="width: 50%;
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 350px;" 
      src="crewcoinlogo.png">
</br>
<div style="text-align: center; justify-content: space-evenly;" >
      <img style="width: 50px; flex: 1" src="coinIconSmall.gif">
      <h1 style="display: inline">Welcome to Crew Coin, ${req.body.firstname}!</h1>
  </div>
</b>
<h2 style="text-align: center; ">Ask your manager what you can do to earn your first Crew Coin!</h2> </b> 
 </b></b></b>
      <p style="text-align: center; "> You have successfully signed up for Crew Coin. </p> </b>
      <p style="text-align: center;"> If you have any questions, please contact us at
      <a href="mailto:admin@crew-coin.com"> admin@crew-coin.com </a>
      `,
    };

    CrewUser.register(
      new CrewUser({ username: req.body.username }),
      req.body.password,
      (err, crewuser) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        } else {
          if (req.body.firstname) {
            crewuser.firstname = req.body.firstname;
          }
          if (req.body.lastname) {
            crewuser.lastname = req.body.lastname;
          }
          if (req.body.portalId) {
            crewuser.portalId = req.body.portalId;
          }
          if (req.body.organization) {
            crewuser.organization = req.body.organization;
          }
          if (req.body.balance) {
            crewuser.balance = req.body.balance;
          }
          if (req.body.pushToken) {
            crewuser.pushToken = req.body.pushToken;
          }
          if (req.body.history) {
            crewuser.history = req.body.history;
          }
          if (req.body.phone) {
            crewuser.phone = req.body.phone;
          }
          crewuser.save(err => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({ err: err });
              return;
            }
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({
                success: true,
                status: 'Registration Successful!',
                user: {
                  firstname: req.user.firstname,
                  lastname: req.user.lastname,
                  username: req.user.username,
                  portalId: req.user.portalId,
                  organization: req.user.organization,
                  admin: req.user.admin,
                  balance: req.user.balance,
                  history: req.user.history,
                  phone: req.user.phone,
                  pushToken: req.user.pushToken,
                  joined: req.user.createdAt,
                  id: req.user._id
                }
              });
            });
          });
          transporter.sendMail(mailData, function (err, info) {
            if (err)
              console.log(err)
            else
              console.log(info);
          });
        }
      }
    );

  });
crewUserRouter.route(`/login`)
  .options((req, res) => { res.sendStatus(200); })
  .post(passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.json({
      success: true,
      token: token,
      status: 'You are successfully logged in!',
      user: {
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        username: req.user.username,
        organization: req.user.organization,
        admin: req.user.admin,
        portalId: req.user.portalId,
        balance: req.user.balance,
        history: req.user.history,
        phone: req.user.phone,
        joined: req.user.createdAt,
        _id: req.user._id
      }
    });
  });
crewUserRouter.route('/passchange/:username')
  .put(authenticate.verifyUser, (req, res, next) => {
    const mailDataPassChange = {
      from: 'admin@crew-coin.com',  // sender address
      to: req.username,   // list of receivers
      subject: 'Crew Coin Password Change', // Subject line
      text: `Your password has been changed!`, // plain text body
      html: 'Embedded image: <img src="cid:unique@crew-coin.com"/>',
      html: 'Embedded image: <img src="cid:uniquegif@crew-coin.com"/>',
      attachments: [{
        filename: 'crewcoinlogo.png',
        path: 'https://firebasestorage.googleapis.com/v0/b/crewcoin-3d719.appspot.com/o/crewcoinlogo.png?alt=media&token=04d9cef4-abb6-4579-a14c-eacc3d7c2983',
        cid: 'unique@crew-coin.com' //same cid value as in the html img src
      },
      {
        filename: 'coinIconSmall.gif',
        path: 'https://firebasestorage.googleapis.com/v0/b/crewcoin-3d719.appspot.com/o/coinIconSmall.gif?alt=media&token=4d227f37-88e7-4645-9dd1-7d806ed7307e',
        cid: 'uniquegif@crew-coin.com' //same cid value as in the html img src
      }],
      html: `
      <img style="width: 50%;
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 350px;" 
      src="crewcoinlogo.png">
    </br>
    <div style="text-align: center; justify-content: space-evenly;" >
      <img style="width: 50px; flex: 1" src="coinIconSmall.gif">
      <h1 style="display: inline">Your password has been changed!</h1>
    </div>
    </b>
      <p style="text-align: center;"> If you have any questions, please contact us at
      <a href="mailto:admin@crew-coin.com"> admin@crew-coin.com </a>
      `,
    };
    CrewUser.findOne({ "username": req.params.username })
      .then(crewuser => {
        crewuser.setPassword(req.body.password, () => {
          crewuser.save()
            .then(() => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({
                success: true,
                status: 'Password Changed Successfully!'
              });
            })
            .catch(err => next(err));
        });
        transporter.sendMail(mailDataPassChange, function (err, info) {
          if (err)
            console.log(err)
          else
            console.log(info);
        });
      })
      .catch(err => next(err));
  });


crewUserRouter.route(`/logout`)
  .options((req, res) => { res.sendStatus(200); })
  .get((req, res, next) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    } else {
      const err = new Error('You are not logged in!');
      err.status = 401;
      return next(err);
    }
  });

crewUserRouter.route('/:userId') ////////////////////////////////////
  .put(authenticate.verifyUser, (req, res, next) => {
    const image = req.body.history.prize.image;
    const email = req.body.email;
    const user = req.body.name;
    const portalId = req.body.portalId;
    const prize = req.body.history.prize.title;
    const cost = req.body.history.prize.cost;
    if (req.body.password) {
      password = req.body.password;
      CrewUser.findByIdAndUpdate(req.params.userId,
        {
          password: req.body.password
        },
      )
    }
    if (req.body.purchase) {
      CrewUser.find({admin: true})
        .then(crewuser => {
          const adminEmail = crewuser[0].username;
          const mailDataPurchase = {
            from: 'admin@crew-coin.com',  // sender address
            to: [email, adminEmail],   // list of receivers
            subject: 'New Crew Coin Purchase!', // Subject line
            text: `${user}, Your New Crew Coin Purchase!`, // plain text body
            html: 'Embedded image: <img src="cid:unique@crew-coin.com"/>',
            html: 'Embedded image: <img src="cid:uniquegif@crew-coin.com"/>',
            html: 'Embedded image: <img src="cid:prize@crew-coin.com"/>',
            attachments: [{
              filename: 'crewcoinlogo.png',
              path: 'https://firebasestorage.googleapis.com/v0/b/crewcoin-3d719.appspot.com/o/crewcoinlogo.png?alt=media&token=04d9cef4-abb6-4579-a14c-eacc3d7c2983',
              cid: 'unique@crew-coin.com' //same cid value as in the html img src
            },
            {
              filename: 'prize.png',
              path: `${image}`,
              cid: 'prize@crew-coin.com' //same cid value as in the html img src
            }],
            html: `
        <img style="width: 50%;
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 350px;" 
        src="crewcoinlogo.png">
        <h1 style="text-align: center; color="#FFD700">New Purchase!</h1> <br>
        <img style="width: 50%;
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 350px;" 
        src="prize.png">
      </br>
      <div style="text-align: center; justify-content: space-evenly;" >
        <h1 style="display: inline">${user}, Your purchase has been confirmed!</h1> <br>
        <h2 style="display: inline">${user} purchased: ${prize} for ${coin(cost)}</h2>
      </div>
      </b>
        <p style="text-align: center;"> Please allow time for processing.</p> <br>
        <p style="text-align: center;"> If you have any questions, please contact your administrator at
        <a href="mailto:${adminEmail}"> ${adminEmail} </a> </p>
        `,
          };
          transporter.sendMail(mailDataPurchase, function (err, info) {
            if (err)
              console.log(err)
            else
              console.log(info);
          })
        })
    }   
CrewUser.findByIdAndUpdate(req.params.userId,
  {
    $push: { history: [req.body.history] },
    balance: req.body.balance
  },
)
  .then(crewuser => {
    console.log('History entry created ', crewuser);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      crewuser,
      success: true
    });
  })
  .catch(err => next(err));
    })
    
  .delete ((req, res, next) => {
  CrewUser.findByIdAndRemove(req.params.userId)
    .then(() => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        status: 'User Deleted!'
      });
    })
    .catch(err => next(err));
});

crewUserRouter.route('/send/:userId')
  .put(authenticate.verifyUser, (req, res, next) => {
    CrewUser.findOneAndUpdate({ _id: req.body.userId },
      {
        $push: { history: [req.body.history2] },
        balance: req.body.balance
      },
    ).then(() => {
      CrewUser.findOneAndUpdate({ _id: req.params.userId },
        {
          $push: { history: [req.body.history] },
          balance: req.body.balance2
        },
      )
        .then(() => {
          console.log('History entry created ');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true
          });
        })
        .catch(err => next(err));
    })
      .catch(err => next(console.log(err)))
  });

module.exports = crewUserRouter;