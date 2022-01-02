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
        res.json(announcements);
      })
      .catch((err) => next(err));
  })
  .post(cors.cors, (req, res, next) => {
    Announcements.create(req.body)
      .then((announcements) => {
        console.log('Form entry created ', announcements);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({announcements, success: true,});
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

announcementsRouter.route('/:announcementsId')
.put((req, res, next) => {
  Announcements.findByIdAndUpdate(req.params.announcementsId, {
        $set: req.body
    }) 
    .then(announcements => {
        console.log('Form entry created ', announcements);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(announcements);
    })
    .catch(err => next(err));
});



module.exports = announcementsRouter;