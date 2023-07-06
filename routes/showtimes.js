const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Showtime, validate, validateId } = require('../models/showtime');
const { Movie } = require('../models/movie');
const { Format } = require('../models/format');
const { Theater } = require('../models/theater');
const { TheaterList } = require('../models/theater-list');
const { ShowtimeManagement } = require('../models/showtime-managment');

router.get('/', async (req, res) => {
  const showtimes = await Showtime.find().sort({ 'movie.name': 1 });
  res.send(showtimes);
});


router.post('/', async (req, res) => {
  const theaterManagement = await TheaterList.findOne({ "date": req.body.date });
  if (!theaterManagement) res.status(404).send('Not any theater set up on that day.');

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  const format = await Format.findById(req.body.formatId);
  if (!format) return res.status(400).send('Invalid format');

  const theater = await Theater.findById(req.body.theaterId);
  if (!theater) return res.status(400).send('Invalid theater');

  const showtimeManagement = await ShowtimeManagement.findOne()
    .and([{ "movie._id": movie._id }, { "date": req.body.date }]);
  if (!showtimeManagement) return res.status(404).send('The movie with the given ID was not have any showtime on that day.');

  const checkExistence = await Showtime.findOne()
    .and([
      { "date": req.body.date },
      { "movie._id": req.body.movieId },
      { "format._id": req.body.formatId },
      { "theater._id": req.body.theaterId },
      { "time": req.body.time }
    ]);
  if (checkExistence) return res.status(404).send('This movie already have showtime at that time in this theater.');

  // const theater = theaterManagement.theaters.filter(
  //   function (theater) { return theater._id == req.body.theaterId; });
  // const checkTime = theater.times.filter(function(time) {return time === req.body.time});
  // if (checkTime.lenghth == 0)  return res.status(404).send('No time of this theater .');

  let showtime = new Showtime({
    date: req.body.date,
    movie: movie,
    format: format,
    theater: theater,
    time: req.body.time,
  });

  const formatIndex = showtimeManagement.formats.findIndex((format) => format._id == req.body.formatId);
  if (formatIndex == -1) return res.status(404).send('This movie doesnt have this format.');

  const theaterIndex = theaterManagement.theaters.findIndex((theater) => theater._id == req.body.theaterId);
  const timeIndex = theaterManagement.theaters[theaterIndex].times.findIndex((time) => time == req.body.time);
  if (timeIndex == -1) return res.status(404).send('This theater doesnt have this time.');

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {

      const result = await showtime.save();

      showtimeManagement.formats[formatIndex].showtimes.push(showtime);
      showtimeManagement.formats[formatIndex].showtimes.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
      showtimeManagement.save();

      theaterManagement.theaters[theaterIndex].times =
        theaterManagement.theaters[theaterIndex].times.filter(e => e != req.body.time);
      theaterManagement.save();

      res.send(result);
    });

    session.endSession();
    console.log('success');
  } catch (error) {
    console.log('error111', error.message);
  }
});

// router.put('/:id', async (req, res) => {
//   if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const movie = await Movie.findById(req.body.movieId);
//   if (!movie) return res.status(400).send('Invalid movie');

//   const format = await Format.findById(req.body.formatId);
//   if (!format) return res.status(400).send('Invalid format');

//   const theater = await Theater.findById(req.body.theater);
//   if (!theater) return res.status(400).send('Invalid theater');

//   const showtimeManagement = await ShowtimeManagement.findOne({ "movie._id": movie._id });
//   if (!showtimesManagement) return res.status(404).send('The movie with the given ID was not have any showtime.');

//   const checkTime = theater.times.filter(function (time) { return time === req.body.time; });
//   if (checkTime.lenghth > 0) return res.status(404).send('This showtime of this theater is already booked.');

//   const rated = await Rated.findByIdAndUpdate(req.params.id,
//     {
//       symbol: req.body.symbol,
//       description: req.body.description
//     },
//     { new: true });

//   if (!rated) return res.status(404).send('The rated with the given ID was not found.');

//   res.send(rated);
// });

// router.delete('/:id', async (req, res) => {
//   if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

//   const rated = await Rated.findByIdAndRemove(req.params.id);

//   if (!rated) return res.status(404).send('The rated with the given ID was not found.');

//   res.send(rated);
// });

router.get('/:id', async (req, res) => {
  if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

  const showtime = await Showtime.findById(req.params.id);

  if (!showtime) return res.status(404).send('The showtime with the given ID was not found.');

  res.send(showtime);
});

module.exports = router;