const express = require('express');
const router = express.Router();
const {ComingSoonList, validate, validateId} = require('../models/movie-list')
const {Movie} = require('../models/movie')


router.get('/', async(req,res) => {
    const comingSoonList = await ComingSoonList.find().populate('movies', 'title rated posterPath ');
    res.send(comingSoonList);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body); //Joi validate
    if (error) return res.status(400).send(error.details[0].message);

    const movies = await Movie.find().where('_id').in(req.body.moviesId); //Mongoose validate
    if (movies.length != req.body.moviesId.length) return res.status(400).send('Invalid movie');

    let comingSoonList = await ComingSoonList.findOne();
    if (!comingSoonList) {
        comingSoonList = new ComingSoonList({
            listName: req.body.listName,
            movies: req.body.moviesId
        });
    } else {
        const checkMovie = req.body.moviesId.every(value => {
            return comingSoonList.movies.includes(value);
        });
        if (checkMovie) return res.status(400).send('The movie already exists.');
        comingSoonList.movies.push(req.body.moviesId)
    }


    await comingSoonList.save();
    res.send(comingSoonList);
});


//delete theo id movie
router.delete('/:id', async (req, res) => {

    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    let comingSoonList = await ComingSoonList.findOne();

    if (!comingSoonList) return res.status(404).send('Not exists');
    comingSoonList.movies = comingSoonList.movies.filter(e => e != req.params.id);
    console.log(comingSoonList.movies)
    await comingSoonList.save();
    res.send(comingSoonList);
});


module.exports = router;
