const express = require('express');
const router = express.Router();
const {SpecialList, validate, validateId} = require('../models/movie-list')
const {Movie} = require('../models/movie')


router.get('/', async(req,res) => {
    const specialList = await SpecialList.find().populate('movies', 'title rated posterPath ');
    res.send(specialList);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body); //Joi validate
    if (error) return res.status(400).send(error.details[0].message);

    const movies = await Movie.find().where('_id').in(req.body.moviesId); //Mongoose validate
    if (movies.length != req.body.moviesId.length) return res.status(400).send('Invalid movie');

    let specialList = await SpecialList.findOne();
    if (!specialList) {
        specialList = new SpecialList({
            listName: req.body.listName,
            movies: req.body.moviesId
        });
    } else {
        const checkMovie = req.body.moviesId.every(value => {
            return specialList.movies.includes(value);
        });
        if (checkMovie) return res.status(400).send('The movie already exists.');
        specialList.movies.push(req.body.moviesId)
    }


    await specialList.save();
    res.send(specialList);
});


//delete theo id movie
router.delete('/:id', async (req, res) => {

    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    let specialList = await SpecialList.findOne();

    if (!specialList) return res.status(404).send('Not exists');
    specialList.movies = specialList.movies.filter(e => e != req.params.id);
    console.log(specialList.movies)
    await specialList.save();
    res.send(specialList);
});


module.exports = router;
