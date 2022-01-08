const express = require('express');
const announcementsRouter = express.Router();
const cors = require('./cors');
const Announcements = require('../models/announcements');
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
    res.json(savedimage)
    Announcements.create(
      {
        portalId: req.body.portalId,
        title: req.body.title,
        description: req.body.description,
        image: savedimage
      }
    )
      .then(Announcements.find())
      .then((announcements) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ announcements, success: true });
      })
      .catch((err) => next(err));
  })
  // ('/upload', upload.single('myFile'), async(req, res, next) => {
  //   const file = req.file
  //   if (!file) {
  //     const error = new Error('Please upload a file')
  //     error.httpStatusCode = 400
  //     return next("hey error")
  //   }


  //     const imagepost= new model({
  //       image: file.path
  //     })
  //     const savedimage= await imagepost.save()
  //     res.json(savedimage)

  // })
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