const mongoose = require('mongoose');
const Joi = require('joi');

const ratedSchema = mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        enum: ['C18', 'C16', 'C13', "P", "K"]
    },
});

const movieSchema = mongoose.Schema({
    title: {
        required: true,
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    runtime: {
        type: Number
    },
    rated: {
        required: true,
        type: ratedSchema,
    }
});

const formatSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    seatPrice: {
        type: Number,
        required: true
    },
    tech: {
        required: true,
        type: String
    }
});

const theaterSchema = mongoose.Schema({
    name: {
      type:String,
      required:true,
      minlength:3,
    },
    numberOfSeat:{
      type: Number,
      required: true
    },
    numberOfRow:{
      type: Number,
      required: true
    },
    numberOfColumn: {
      type: Number,
      required: true
    }
  });

const showtimeSchema = mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    format: {
        type: formatSchema,
        required: true
    },
    theater: {
        type: theaterSchema,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    seatsBooked: {
        type: [Number],
        required: true
    },
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

function validateShowtime(Showtime) {
    const schema = Joi.object({
        date: Joi.string().required(),
        movieId: Joi.objectId().required(),
        formatId: Joi.objectId().required(),
        theaterId: Joi.objectId().required(),
        time: Joi.string().required(),
    });

    return schema.validate(Showtime);
};

function validateId(id) {
    return mongoose.Types.ObjectId.isValid(id);
};

module.exports.showtimeSchema = showtimeSchema;
module.exports.Showtime = Showtime;
module.exports.validate = validateShowtime;
module.exports.validateId = validateId;