const express = require('express');
const announcementsRouter = express.Router();
const cors = require('./cors');
const Announcements = require('../models/announcements');
const authenticate = require('../authenticate');



announcementsRouter.route('/')
.options( (req, res) => { res.sendStatus(200); })
.get(  (req, res, next) => {
  Announcements.find()
      .then((announcements) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({announcements, success: true});
      })
      .catch((err) => next(err));
  })
  .post(cors.cors, (req, res, next) => {
    Announcements.create(req.body)
      .then (Announcements.find())
      .then((announcements) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({announcements, success: true});
      })
      .catch((err) => next(err));
  })
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /borrow');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('Delete operation not supported on /borrow');
});

announcementsRouter.route('/:portalId')
.options( (req, res) => { res.sendStatus(200); })
.get(  (req, res, next) => {
  Announcements.find({"portalId": req.params.portalId})
    .then(announcements => {
        console.log('Found ', announcements);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({announcements, success: true});
    })
    .catch(err => next(err));
});



module.exports = announcementsRouter;