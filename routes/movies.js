const express = require('express');
const router = express.Router();
const { Movie, validate, validateId } = require('../models/movie');
const { Genre } = require('../models/genre');
const { Rated } = require('../models/rated');

router.get('/', async (req, res) => {
    const movie = await Movie.find().sort('title');
    res.send(movie);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body); //Joi validate
    if (error) return res.status(400).send(error.details[0].message);

    const genres = await Genre.find().where('_id').in(req.body.genreId); //Mongoose validate
    if (genres.length != req.body.genreId.length) return res.status(400).send('Invalid genre');

    const rated = await Rated.findById(req.body.ratedId);
    if (!rated) return res.status(400).send('Invalid rated');

    const movie = new Movie({
        title: req.body.title,
        genres: genres,
        posterPath: req.body.posterPath,
        backdropPath: req.body.backdropPath,
        releaseDate: req.body.releaseDate,
        overview: req.body.overview,
        rated: rated,
        isReleased: req.body.isReleased,
        runtime: req.body.runtime,
        language: req.body.language,
        trailer: req.body.trailer,
        cast: req.body.cast,
        director: req.body.director
    });

    await movie.save();
    res.send(movie);
});

router.put('/overview/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const movie = await Movie.updateOne(
        { "_id": req.params.id },
        { "$set": {"overview": req.body.overview}}
    )

    res.send(movie);
})

router.put('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genres = await Genre.find().where('_id').in(req.body.genreId);
    if (genres.length != req.body.genreId.length) return res.status(400).send('Invalid genre');

    const rated = await Rated.findById(req.body.ratedId);
    if (!rated) return res.status(400).send('Invalid rated');

    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            genres: genres,
            posterPath: req.body.posterPath,
            backdropPath: req.body.backdropPath,
            releaseDate: req.body.releaseDate,
            overview: req.body.overview,
            rated: rated,
            isReleased: req.body.isReleased,
            runtime: req.body.runtime,
            language: req.body.language,
            trailer: req.body.trailer,
            cast: req.body.cast,
            director: req.body.director
        },
        { new: true }
    );
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given ID was not found');

    res.send(movie);
});

router.get('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given ID was not found');

    res.send(movie);

});

module.exports = router;
