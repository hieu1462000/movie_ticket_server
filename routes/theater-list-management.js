const express = require('express');
const router = express.Router();
const {TheaterList, validate, validateId} = require('../models/theater-list')
const {Theater} = require('../models/theater')


router.get('/', async(req,res) => {
    const theaterListManagement = await TheaterList.find().sort({date:1});
    res.send(theaterListManagement);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const theaters = await Theater.find();

    let theaterListManagement = await TheaterList.findOne({'date': req.body.date});
    if (theaterListManagement) return res.status(400).send('The management already exists.');

    theaterListManagement = new TheaterList({
        date: req.body.date,
        theaters: theaters
    });


    await theaterListManagement.save();
    res.send(theaterListManagement);
});


router.delete('/:id', async (req, res) => {

    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const theaterListManagement = await TheaterList.findByIdAndRemove(req.params.id);

    if (!theaterListManagement) return res.status(404).send('The management with the given ID was not found.');

    res.send(theaterListManagement);
});


module.exports = router;
