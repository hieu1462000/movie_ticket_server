const express = require('express');
const router = express.Router();
const { Recommended, validate, validateId } = require('../models/recommended');

router.get('/', async (req, res) => {
    const recommended = await Recommended.find();
    res.send(recommended);
});


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let recommended = new Recommended({
        _id: req.body._id,
        type: req.body.type,
        posterPath: req.body.posterPath
    });

    recommended = await recommended.save();
    res.send(recommended);
});

router.delete('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const recommended = await Recommended.findByIdAndRemove(req.params.id);

    if (!recommended) return res.status(404).send('The recommended with the given ID was not found.');

    res.send(recommended);
});

router.get('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const recommended = await Recommended.findById(req.params.id);

    if (!recommended) return res.status(404).send('The recommended with the given ID was not found.');

    res.send(recommended);
});

module.exports = router;