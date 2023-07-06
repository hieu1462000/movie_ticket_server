const express = require('express');
const router = express.Router();
const {NowShowingList, validate, validateId} = require('../models/movie-list')
const {Movie} = require('../models/movie')


router.get('/', async(req,res) => {
    const nowShowingList = await NowShowingList.find().populate('movies', 'title rated posterPath ');
    res.send(nowShowingList);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body); //Joi validate
    if (error) return res.status(400).send(error.details[0].message);

    const movies = await Movie.find().where('_id').in(req.body.moviesId); //Mongoose validate
    if (movies.length != req.body.moviesId.length) return res.status(400).send('Invalid movie');

    let nowShowingList = await NowShowingList.findOne();
    if (!nowShowingList) {
        nowShowingList = new NowShowingList({
            listName: req.body.listName,
            movies: req.body.moviesId
        });
    } else {
        const checkMovie = req.body.moviesId.every(value => {
            return nowShowingList.movies.includes(value);
        });
        if (checkMovie) return res.status(400).send('The movie already exists.');
        nowShowingList.movies.push(req.body.moviesId)
    }


    await nowShowingList.save();
    res.send(nowShowingList);
});


//delete theo id movie
router.delete('/:id', async (req, res) => {

    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    let nowShowingList = await NowShowingList.findOne();

    if (!nowShowingList) return res.status(404).send('Not exists');
    nowShowingList.movies = nowShowingList.movies.filter(e => e != req.params.id);
    console.log(nowShowingList.movies)
    await nowShowingList.save();
    res.send(nowShowingList);
});


module.exports = router;
