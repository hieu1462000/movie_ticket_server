const express = require('express');
const router = express.Router();
const { Snack, validate, validateId } = require('../models/snack');

router.get('/', async (req, res) => {
    const snack = await Snack.find().sort('title');
    res.send(snack);
});


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let snack = new Snack({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        posterPath: req.body.posterPath
    });

    snack = await snack.save();
    res.send(snack);
});

router.put('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const snack = await Snack.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            posterPath: req.body.posterPath
        },
        { new: true });

    if (!snack) return res.status(404).send('The snack with the given ID was not found.');

    res.send(snack);
});

router.delete('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const snack = await Snack.findByIdAndRemove(req.params.id);

    if (!snack) return res.status(404).send('The snack with the given ID was not found.');

    res.send(snack);
});

router.get('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const snack = await Snack.findById(req.params.id);

    if (!snack) return res.status(404).send('The snack with the given ID was not found.');

    res.send(snack);
});

module.exports = router;