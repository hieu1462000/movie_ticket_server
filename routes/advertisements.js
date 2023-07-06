const express = require('express');
const router = express.Router();
const { Advertisement, validate, validateId } = require('../models/advertisement');

router.get('/', async (req, res) => {
    const advertisement = await Advertisement.find().sort('title');
    res.send(advertisement);
});


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let advertisement = new Advertisement({
        title: req.body.title,
        description: req.body.description,
        posterPath: req.body.posterPath
    });

    advertisement = await advertisement.save();
    res.send(advertisement);
});

router.put('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const advertisement = await Advertisement.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            description: req.body.description,
            posterPath: req.body.posterPath
        },
        { new: true });

    if (!advertisement) return res.status(404).send('The advertisement with the given ID was not found.');

    res.send(advertisement);
});

router.delete('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const advertisement = await Advertisement.findByIdAndRemove(req.params.id);

    if (!advertisement) return res.status(404).send('The advertisement with the given ID was not found.');

    res.send(advertisement);
});

router.get('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) return res.status(404).send('The advertisement with the given ID was not found.');

    res.send(advertisement);
});

module.exports = router;