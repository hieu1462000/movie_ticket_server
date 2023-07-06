const mongoose = require('mongoose');
const Joi = require('joi');

const ticketSchema = mongoose.Schema({
    userId: {
        required: true,
        type: String
    },
    showtimeId: {
        required: true,
        type: String
    },
    posterPath: {
        required: true,
        type: String
    },
    movieTitle: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    showtime: {
        type: String,
        required: true
    },
    runtime: {
        type: Number,
        required: true
    },
    theater: {
        type: String,
        required: true
    },
    seat: {
        type: [Number],
        required: true
    },
    snack: {
        type: String,
        required: false,
        minlength: 0,
        set: a => a === '' ? undefined : a
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    ticketPrice: {
        type: Number,
        required: true,
        min: 0
    },
    snackPrice: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        required: true
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

function validateTicket(ticket) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        showtimeId: Joi.string().required(),
        posterPath: Joi.string().required(),
        movieTitle: Joi.string().required(),
        snack: Joi.string().min(0),
        date: Joi.string().required(),
        showtime: Joi.string().required(),
        runtime: Joi.number().required(),
        theater: Joi.string().required(),
        seat: Joi.array().items(Joi.number().required()).required(),
        totalPrice: Joi.number().min(0).required(),
        ticketPrice: Joi.number().min(0).required(),
        snackPrice: Joi.number().min(0).required(),
        paymentMethod: Joi.string().required()
    });

    return schema.validate(ticket);
};

function validateId(id) {
    return mongoose.Types.ObjectId.isValid(id);
};

module.exports.Ticket = Ticket;
module.exports.validate = validateTicket;
module.exports.validateId = validateId;