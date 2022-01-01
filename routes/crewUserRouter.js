const express = require('express');
const CrewUser = require('../models/crewuser');
const passport = require('passport');
const crewUserRouter = express.Router();
const authenticate = require('../authenticate');



/* GET users listing. */

crewUserRouter.route('/:portalId')
  .options((req, res) => { res.sendStatus(200); })
  .get(function (req, res, next) {
    CrewUser.find( { portalId: req.params.portalId } )
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
    CrewUser.find( { _id: req.params._id } )
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
          if (req.body.balnce) {
            crewuser.balance = req.body.balance;
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
                  balance: req.user.balance,
                  history: req.user.history,
                  phone: req.user.phone,
                  joined: req.user.createdAt,
                  id: req.user._id
                }
              });
            });
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
        portalId: req.user.portalId,
        balance: req.user.balance,
        history: req.user.history,
        phone: req.user.phone,
        joined: req.user.createdAt,
        _id: req.user._id

      }
    });
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

  crewUserRouter.route('/:userId')
.put((req, res, next) => {
    CrewUser.findByIdAndUpdate(req.params.userId, 
      {balance: req.user.balance},
      { $push: { history: req.user.history } }
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
});

module.exports = crewUserRouter;