const express = require('express');
const storeRouter = express.Router();
const cors = require('./cors');
const Store = require('../models/store');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('You can upload only image files!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });



storeRouter.route('/')
  .options((req, res) => { res.sendStatus(200); })
  .get((req, res, next) => {
    Store.find()
      .then((store) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(store);
      })
      .catch((err) => next(err));
  })
  // .post(cors.cors, (req, res, next) => {
  //   Store.create(req.body)
  //     .then((store) => {
  //       console.log('Form entry created ', store);
  //       res.statusCode = 200;
  //       res.setHeader('Content-Type', 'application/json');
  //       res.json({ store, success: true });
  //     })
  //     .catch((err) => next(err));
  // })
  .post(cors.cors, upload.single('myFile'), async (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next("hey error")
    }


    const imagepost = new model({
      image: file.path
    })
    const savedimage = await imagepost.save()
    Store.create(
      {
        portalId: req.body.portalId,
        title: req.body.title,
        description: req.body.description,
        cost: req.body.cost,
        image: image
      }
    )
      .then(Store.find())
      .then((store) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ store, success: true });
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
  .options((req, res) => { res.sendStatus(200); })
  .get((req, res, next) => {
    Store.find({ "portalId": req.params.portalId })
      .then(prizes => {
        console.log('Found ', prizes);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ prizes, success: true });
      })
      .catch(err => next(err));
  });
storeRouter.route('/:prizeId')
  .delete((req, res) => {
    Store.findByIdAndDelete(req.params.prizeId,
      {
        prizeId: req.body._id
      }
    )
      .then(prizes => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          prizes,
          success: true
        });
      })
      .catch(err => next(err));
  });





module.exports = storeRouter;