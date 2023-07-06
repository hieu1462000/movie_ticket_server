const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Ticket, validate, validateId } = require('../models/ticket');
const {Showtime} = require('../models/showtime');

router.get('/', async (req, res) => {
    const ticket = await Ticket.find().sort('date');
    res.send(ticket);
});

router.get('/user/:userId', async (req, res) => {
    const ticket = await Ticket.find({'userId': req.params.userId});
    res.send(ticket);
})

router.get('/:ticketId', async (req, res) => {
    if (!validateId(req.params.ticketId)) return res.status(404).send('Invalid ID');

    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) return res.status(404).send('The ticket with the given ID was not found.');

    res.send(ticket);
});


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const showtime = await Showtime.findById(req.body.showtimeId);
    if (!showtime) return res.status(400).send('Invalid showtime');

    let ticket = new Ticket({
        userId: req.body.userId,
        showtimeId: req.body.showtimeId,
        posterPath: req.body.posterPath,
        movieTitle: req.body.movieTitle,
        date: req.body.date,
        showtime: req.body.showtime,
        runtime: req.body.runtime,
        theater: req.body.theater,
        seat: req.body.seat,
        snack: req.body.snack,
        totalPrice: req.body.totalPrice,
        ticketPrice: req.body.ticketPrice,
        snackPrice: req.body.snackPrice,
        paymentMethod: req.body.paymentMethod,
    });

    try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
          const result = await ticket.save();

          showtime.seatsBooked.push.apply(showtime.seatsBooked, req.body.seat);
          showtime.save();
          
          res.send(result);
        });
    
        session.endSession();
        console.log('success');
      } catch (error) {
        console.log('error111', error.message);
      }

});


router.delete('/:ticketId', async (req, res) => {
    if (!validateId(req.params.ticketId)) return res.status(404).send('Invalid ID');

    const ticket = await Ticket.findByIdAndRemove(req.params.id);

    if (!ticket) return res.status(404).send('The ticket with the given ID was not found.');

    res.send(ticket);
});

module.exports = router;