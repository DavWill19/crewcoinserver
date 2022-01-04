const express = require('express');
const storeRouter = express.Router();
const cors = require('./cors');
const Store = require('../models/store');
const authenticate = require('../authenticate');



storeRouter.route('/')
.options( (req, res) => { res.sendStatus(200); })
.get(  (req, res, next) => {
  Store.find()
      .then((store) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(store);
      })
      .catch((err) => next(err));
  })
  .post(cors.cors, (req, res, next) => {
    Store.create(req.body)
      .then((store) => {
        console.log('Form entry created ', store);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({store, success: true});
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

storeRouter.route('/:portalId')
.options( (req, res) => { res.sendStatus(200); })
.get(  (req, res, next) => {
  Store.find({"portalId": req.params.portalId})
    .then(prizes => {
        console.log('Found ', prizes);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({prizes, success: true});
    })
    .catch(err => next(err));
});



module.exports = storeRouter;