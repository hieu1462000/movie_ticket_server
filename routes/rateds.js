const express = require('express');
const router = express.Router();
const {Rated, validate, validateId} = require('../models/rated');

  router.get('/', async (req, res) => {
    const rateds = await Rated.find().sort('symbol');
    res.send(rateds);
  });

  
  router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let rated = new Rated({
        symbol: req.body.symbol,
        description: req.body.description
    }); 

    rated = await rated.save();
    res.send(rated);
  });
  
  router.put('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const rated = await Rated.findByIdAndUpdate(req.params.id, 
        {
            symbol: req.body.symbol,
            description: req.body.description
        }, 
        {new: true});

    if (!rated) return res.status(404).send('The rated with the given ID was not found.');
  
    res.send(rated);
  });
  
  router.delete('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const rated = await Rated.findByIdAndRemove(req.params.id);
    
    if (!rated) return res.status(404).send('The rated with the given ID was not found.');
  
    res.send(rated);
  });
  
  router.get('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const rated = await Rated.findById(req.params.id);
    
    if (!rated) return res.status(404).send('The rated with the given ID was not found.');
    
    res.send(rated);
  });

  module.exports = router;