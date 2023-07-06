const express = require('express');
const router = express.Router();
const {Format, validate, validateId} = require('../models/format');

  router.get('/', async (req, res) => {
    const formats = await Format.find().sort('_id');
    res.send(formats);
  });
  
  router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let format = new Format({
        name: req.body.name,
        seatPrice: req.body.seatPrice,
        tech: req.body.tech,
    }); 

    format = await format.save();
    res.send(format);
  });
  
  router.put('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const format = await Format.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,
            seatPrice: req.body.seatPrice,
            tech: req.body.tech,
        }, 
        {new: true});

    if (!format) return res.status(404).send('The format with the given ID was not found.');
  
    res.send(format);
  });
  
  router.delete('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const format = await Format.findByIdAndRemove(req.params.id);
    
    if (!format) return res.status(404).send('The format with the given ID was not found.');
  
    res.send(format);
  });
  
  router.get('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(404).send('Invalid ID');

    const format = await Format.findById(req.params.id);
    
    if (!format) return res.status(404).send('The format with the given ID was not found.');
    
    res.send(format);
  });

  module.exports = router;