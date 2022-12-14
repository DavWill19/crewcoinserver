const express = require('express');
const CrewUser = require('../models/crewuser');
const passport = require('passport');
const crewUserRouter = express.Router();
const authenticate = require('../authenticate');
const nodemailer = require('nodemailer');
const config = require('../config');
const email = require('../email');


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

// 
async function sendEmail(req, res) {

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
  const mailData = {
    from: 'admin@crew-coin.com',  // sender address
    to: req.body.username,   // list of receivers
    subject: 'Welcome to Crew Coin', // Subject line
    text: `Welcome to Crew Coin, ${req.body.firstname}!`, // plain text body
    html: email.welcome(req.body.firstname, logo, gif) // html body
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};
// 

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
    CrewUser.find({ portalId: req.body.portalId })
      .then((user, crewuser) => {
        if (user.length > 0 && req.body.admin === true) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: false, message: 'Portal Id is taken' });
          return;
        } else {
          if (user.length > 0 || req.body.admin === true) {

             CrewUser.register(
              new CrewUser({ username: req.body.username }),
              req.body.password,
              (err, crewuser) => {
                if (err) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ err: err });
                } else {

                  if (req.body.portalId) {
                    crewuser.portalId = req.body.portalId;
                  }
                  if (req.body.firstname) {
                    crewuser.firstname = req.body.firstname;
                  }
                  if (req.body.lastname) {
                    crewuser.lastname = req.body.lastname;
                  }
                  if (req.body.admin) {
                    crewuser.admin = req.body.admin;
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
                  if (req.body.organization) {
                    crewuser.organization = req.body.organization;
                  }
                  if (req.body.type) {
                    crewuser.type = req.body.type;
                  }
                  crewuser.save(err => {
                    if (err) {
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({ err: err });
                      return;
                    }
                    passport.authenticate('local')(req, res, () => {
                      // const mailData = {
                      //   from: 'admin@crew-coin.com',  // sender address
                      //   to: req.body.username,   // list of receivers
                      //   subject: 'Welcome to Crew Coin', // Subject line
                      //   text: `Welcome to Crew Coin, ${req.body.firstname}!`, // plain text body
                      //   html: email.welcome(req.body.firstname, logo, gif) // html body
                      // };
                      // transporter.sendMail(mailData, function (err, info) {
                      //   if (err)
                      //     console.log(err)
                      //   else
                      //     console.log(info);
                      // });
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
                          id: req.user._id,
                          type: req.user.type,
                        }
                      });
                    });
                    sendEmail(req, res);
                  })
                }
              }
            );
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: false, message: 'Portal Id Does not exist. Setup a new account or check Portal Id!' });
            return;
          }
        }
      })
      .catch(err => next(err));
  });

crewUserRouter.route('/crewcoin/:budget')
  .post((req, res, next) => {
    CrewUser.find({ budget: true })
      .then(users => {
        if (users.length > 0) {
          users.forEach(user => {
            user.balance += user.budgetAmount;
            user.save();
            const message = "Cha Ching! <br> Your monthly balance has been increased by " + user.budgetAmount + " Crew Coins! <br> Spend them wisely!";
            const mailDataPassChange = {
              from: 'admin@crew-coin.com',  // sender address
              to: user.username,   // list of receivers
              subject: 'Cha Ching! New Balance!', // Subject line
              text: `New Balance!`, // plain text body
              html: email.password(user.firstname, message, logo, gif) // html body
            };
            transporter.sendMail(mailDataPassChange, function (err, info) {
              if (err) {
                console.log(err);
                res.status = 200;
              }
              else {
                console.log(info);
                res.status = 200;
              }
            });
            console.log(users);
          });
          res.json({ success: true, message: 'Budgets have been added to all users' });
          return;
        } else {
          res.json({ success: false, message: 'No users have budgets' });
          return;
        }
      })
      .catch(err => next(err));
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
        newTransaction: req.user.newTransaction,
        newAnnouncement: req.user.newAnnouncement,
        newStoreItem: req.user.newStoreItem,
        portalId: req.user.portalId,
        balance: req.user.balance,
        history: req.user.history,
        phone: req.user.phone,
        joined: req.user.createdAt,
        _id: req.user._id,
        superUser: req.user.superUser,
        pushToken: req.user.pushToken,
        type: req.user.type,
        budget: req.user.budget,
        budgetAmount: req.user.budgetAmount,

      }
    });
  });
crewUserRouter.route('/passchange/:username')
  .put(authenticate.verifyUser, (req, res, next) => {
    const message = "Your password has been changed!";
    const mailDataPassChange = {
      from: 'admin@crew-coin.com',  // sender address
      to: req.params.username,   // list of receivers
      subject: 'Crew Coin Password Change', // Subject line
      text: `Your password has been changed!`, // plain text body
      html: email.password(req.body.user, message, logo, gif) // html body
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
crewUserRouter.route('/forgotpassword')
  .put((req, res, next) => {
    const tempPass = "Cc#" + Math.random().toString(36).slice(-6);
    const message = `<br> Temporary password: ${tempPass} <br> Please Login into the app and set a new password.`
    const mailDataPassChange = {
      from: 'admin@crew-coin.com',  // sender address
      to: req.body.username,   // list of receivers
      subject: 'Crew Coin Password Change', // Subject line
      text: `<br> Temporary password: ${tempPass} <br> Please Login into the app and set a new password.`, // plain text body
      html: email.password(req.body.username, message, logo, gif) // html body
    };
    CrewUser.findOne({ "username": req.body.username })
      .then(crewuser => {
        crewuser.setPassword(tempPass, () => {
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
    const email1 = req.body.email;
    const user = req.body.name;
    const portalId = req.body.portalId;
    const prize = req.body.history.prize.title;
    const prizeDescription = req.body.history.prize.description;
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
      CrewUser.find({ admin: true })
        .then(crewuser => {
          const filteredByPortalId = crewuser.filter(crewuser => crewuser.portalId === portalId);
          const adminEmail = filteredByPortalId[0].username;
          const mailDataPurchase = {
            from: 'admin@crew-coin.com',  // sender address
            to: [email1, adminEmail],   // list of receivers
            subject: 'New Crew Coin Purchase!', // Subject line
            text: `${user}, Your New Crew Coin Purchase!`, // plain text body
            html: email.purchase(user, prize, prizeDescription, coin(cost), adminEmail, logo, image),
          };
          transporter.sendMail(mailDataPurchase, function (err, info) {
            if (err)
              console.log(err)
            else
              console.log(info);
          })
        })
    }
    CrewUser.findById(req.params.userId)
      .then(crewuser => {
        const balance = crewuser.balance;
        CrewUser.findByIdAndUpdate(req.params.userId,
          {
            $push: { history: [req.body.history] },
            balance: balance - req.body.cost,
            newTransaction: true,
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
  })

  .delete((req, res, next) => {
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
    CrewUser.findById(req.params.userId)
      .then(crewuser => {
        const username = crewuser.username;
        const coinincrease = req.body.coinincrease;
        const receiverbalance = crewuser.balance + coinincrease;
        console.log(receiverbalance, 'receiver balance');
        CrewUser.findOneAndUpdate({ _id: req.params.userId },
          {
            $push: { history: [req.body.history] },
            balance: receiverbalance,
            newTransaction: true
          },
        ).catch(err => next(err));

      })
      .then(() => {
        CrewUser.findById(req.body.userId)
          .then(crewuser => {
            const coindecrease = req.body.coinincrease;
            const senderbalance = crewuser.balance - coindecrease;
            console.log(senderbalance, 'senderbalance');
            CrewUser.findOneAndUpdate({ _id: req.body.userId },
              {
                $push: { history: [req.body.history2] },
                balance: senderbalance
              },
            ).catch(err => next(err));
          })
          .then(() => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              status: 'Coins Sent!'
            });
          })
          .catch(err => next(err));
      })
      .catch(err => next(console.log(err)))
  });

crewUserRouter.route('/adminpush/:userId')
  .put((req, res, next) => {
    CrewUser.findOneAndUpdate({ _id: req.params.userId },
      {
        pushToken: req.body.pushToken
      },
    ).then(() => {
      CrewUser.findById(req.params.userId)
        .then(crewuser => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            crewuser,
          });
        })
    })
      .catch(err => next(console.log(err)))
  });


crewUserRouter.route('/alert/:userId')
  .put((req, res, next) => {
    CrewUser.findOneAndUpdate({ _id: req.params.userId },
      {
        newStoreItem: req.body.newStoreItem,
        newAnnouncement: req.body.newAnnouncement,
        newTransaction: req.body.newTransaction,
      },
    ).then(() => {
      CrewUser.findById(req.params.userId)
        .then(crewuser => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            crewuser,
          });
        })
    })
      .catch(err => next(console.log(err)))
  });

crewUserRouter.route('/quickadd/:userId')
  .put(authenticate.verifyUser, (req, res, next) => {
    CrewUser.findById(req.params.userId)
      .then(crewuser => {
        const username = crewuser.username;
        const coinincrease = req.body.coinincrease;
        const receiverbalance = crewuser.balance + coinincrease;
        console.log(receiverbalance, 'receiver balance');
        CrewUser.findOneAndUpdate({ _id: req.params.userId },
          {
            $push: { history: [req.body.history] },
            balance: receiverbalance,
            newTransaction: true
          },
        ).catch(err => next(err))
      }).then(() => {
        CrewUser.findById(req.params.userId)
          .then(crewuser => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              crewuser,
            });
          })
      })
      .catch(err => next(console.log(err)))
  });

crewUserRouter.route('/addbudget/:userId')
  .put(authenticate.verifyUser, (req, res, next) => {
    CrewUser.findById(req.params.userId)
      .then(crewuser => {
        CrewUser.findOneAndUpdate({ _id: req.params.userId },
          {
            $push: { history: [req.body.history] },
            budgetAmount: req.body.budgetAmount,
            budget: req.body.budget,
          },
        ).catch(err => next(err))
      }).then(() => {
        CrewUser.findById(req.params.userId)
          .then(crewuser => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              crewuser,
            });
          })
      })
      .catch(err => next(console.log(err)))
  });

crewUserRouter.route('/changeadmin/:userId')
  .put(authenticate.verifyUser, (req, res, next) => {
    CrewUser.findById(req.params.userId)
      .then(crewuser => {
        const username = crewuser.username;
        const admin = !req.body.admin;
        CrewUser.findOneAndUpdate({ _id: req.params.userId },
          {
            admin: admin,
            balance: 0,
          },
        ).catch(err => next(err))
      }).then(() => {
        CrewUser.findById(req.params.userId)
          .then(crewuser => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              crewuser,
            });
          })
      })
      .catch(err => next(console.log(err)))
  });





module.exports = crewUserRouter;