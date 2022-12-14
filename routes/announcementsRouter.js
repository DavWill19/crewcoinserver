const express = require('express');
const announcementsRouter = express.Router();
const cors = require('./cors');
const Announcements = require('../models/announcements');
const authenticate = require('../authenticate');
const CrewUser = require('../models/crewuser');



announcementsRouter.route('/')
  .options((req, res) => { res.sendStatus(200); })
  .get((req, res, next) => {
    Announcements.find()
      .then((announcements) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ announcements, success: true });
      })
      .catch((err) => next(err));
  })
  .post(cors.cors, (req, res, next) => {
    const portalId = req.body.portalId;
    CrewUser.updateMany({ portalId: portalId }, { $set: { newAnnouncement: true } })
    .catch((err) => next(err))
      .then(() => {
        console.log('updated')
      }).then(() => {
        Announcements.create(req.body)
          .then(Announcements.find())
          .then((announcements) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ announcements, success: true });
          })

      })
      .catch((err) => console.log(err));
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
  .options((req, res) => { res.sendStatus(200); })
  .get((req, res, next) => {
    Announcements.find({ "portalId": req.params.portalId })
      .then(announcements => {
        console.log('Found ', announcements);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ announcements, success: true });
      })
      .catch(err => next(err));
  });

announcementsRouter.route('/delete/:postId')
  .delete((req, res) => {
    Announcements.findByIdAndDelete(req.params.postId,
      {
        postId: req.body._id
      }
    )
      .then(posts => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          posts,
          success: true
        });
      })
      .catch(err => next(err));
  });



module.exports = announcementsRouter;