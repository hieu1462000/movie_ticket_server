const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rateds = require('./routes/rateds');
const nowShowing = require('./routes/now-showing');
const special = require('./routes/special');
const comingSoon = require('./routes/coming-soon');
const snacks = require('./routes/snacks');
const advertisements = require('./routes/advertisements')
const recommended = require('./routes/recommended-list');
const format = require('./routes/formats');
const showtimes = require('./routes/showtimes');
const showtimesManagement = require('./routes/showtimes-management');
const theaters = require('./routes/theaters');
const theaterListManagement = require('./routes/theater-list-management');
const tickets = require('./routes/tickets');

const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/movie-ticket')
    .then(() => console.log('Connected to Mongo...'))
    .catch(err => console.log('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/rated', rateds);
app.use('/api/nowshowing',nowShowing);
app.use('/api/special',special);
app.use('/api/comingsoon',comingSoon);
app.use('/api/snacks',snacks);
app.use('/api/advertisement',advertisements);
app.use('/api/recommended',recommended);
app.use('/api/format',format);
app.use('/api/showtimes',showtimes);
app.use('/api/showtime-mangement',showtimesManagement)
app.use('/api/theaters',theaters);
app.use('/api/theaters-management',theaterListManagement);
app.use('/api/tickets', tickets);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));