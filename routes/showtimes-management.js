const express = require('express');
const router = express.Router();
const { ShowtimeManagement, validate, validateId } = require('../models/showtime-managment');
const { Movie } = require('../models/movie');
const {Format} = require('../models/format');


router.get('/:date', async (req, res) => {
  // const now = new Date();
  // const nowConvert = now.getHours() * 60 + now.getMinutes();
  // var date = req.query.date;
  // if (!date) return res.status(400).send('req.query.date is required');
  const showtimesManagement = await ShowtimeManagement.find({'date': req.params.date});
  res.send(showtimesManagement);
});


router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  const formats = await Format.find().where('_id').in(req.body.formatId);
  if (formats.length != req.body.formatId.length) return res.status(400).send('Invalid format');


  const checkMovieExistence = await ShowtimeManagement.findOne()
  .and([{ "movie._id": movie._id }, { "date": req.body.date }]);

  if (checkMovieExistence) return res.status(400).send('This movie already exists on that day.');

  let showtimesManagement = new ShowtimeManagement({
    date: req.body.date,
    movie: {
      _id: movie._id,
      title: movie.title,
      rated: movie.rated
    },
    formats: formats
  });

  showtimesManagement = await showtimesManagement.save();
  res.send(showtimesManagement);
});

// router.put('/:id', async (req, res) => {
//   if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const movie = await Movie.findById(req.body.movieId);
//   if (!movie) return res.status(400).send('Invalid movie');

//   const showtimesManagement = await ShowtimeManagement.findByIdAndUpdate(req.params.id,
//     {
//       movie: {
//         _id: movie._id,
//         title: movie.title,
//         rated: movie.rated
//       }
//     },
//     { new: true });

//   if (!showtimesManagement) return res.status(404).send('The management of showtime with the given ID was not found.');

//   res.send(showtimesManagement);
// });

router.delete('/:id', async (req, res) => {
  if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

  const showtimesManagement = await ShowtimeManagement.findByIdAndRemove(req.params.id);

  if (!showtimesManagement) return res.status(404).send('The management of showtime with the given ID was not found.');

  res.send(showtimesManagement);
});

// router.get('/:id', async (req, res) => {
//   if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

//   const showtimesManagement = await ShowtimeManagement.findById(req.params.id);

//   if (!showtimesManagement) return res.status(404).send('The management of showtime with the given ID was not found.');

//   res.send(showtimesManagement);
// });

router.get('/:date/:movieId', async (req, res) => {
  if (!validateId(req.params.movieId)) return res.status(404).send('Invalid ID');
  // var date = req.query.date;
  // if (!date) return res.status(400).send('req.query.date is required');

  const showtimesManagement = await ShowtimeManagement.find()
  .and([{ "movie._id": req.params.movieId },{'date': req.params.date}]);

  if (!showtimesManagement) return res.status(404).send('The movie with the given ID was not found.');

  res.send(showtimesManagement);
})

module.exports = router;