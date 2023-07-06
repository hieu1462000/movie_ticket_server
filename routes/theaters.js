const express = require('express');
const router = express.Router();
const {Theater, validate, validateId} = require('../models/theater');

  router.get('/', async (req, res) => {
    const theaters = await Theater.find().sort('name');
    res.send(theaters);
  });

  router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let theater = new Theater({
        name: req.body.name,
        numberOfSeat: req.body.numberOfSeat,
        numberOfRow: req.body.numberOfRow,
        numberOfColumn: req.body.numberOfColumn,
        times: req.body.times
    }); 

    theater = await theater.save();
    res.send(theater);
  });
  
  router.put('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const theater = await Theater.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,
            numberOfSeat: req.body.numberOfSeat,
            numberOfRow: req.body.numberOfRow,
            times: req.body.times
        }, 
        {new: true});

    if (!theater) return res.status(404).send('The theater with the given ID was not found.');
  
    res.send(theater);
  });
  
  router.delete('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const theater = await Theater.findByIdAndRemove(req.params.id);
    
    if (!theater) return res.status(404).send('The theater with the given ID was not found.');
  
    res.send(theater);
  });
  
  router.get('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const theater = await Theater.findById(req.params.id);
    
    if (!theater) return res.status(404).send('The theater with the given ID was not found.');
    
    res.send(theater);
  });

  module.exports = router;