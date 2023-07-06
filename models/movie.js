const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');
const {ratedSchema} = require('./rated');

const movieSchema = mongoose.Schema({
    title:{
        required:true,
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    genres: {
        required: true,
        type: [genreSchema]
    },
    posterPath: {
        required: true,
        type: String
    },
    backdropPath: {
        required: true,
        type: String
    },
    releaseDate: {
        type: String
    },
    overview: {
        type: String
    },
    rated: {
        required: true,
        type: ratedSchema,
    },
    isReleased: {
        required: true,
        type: Boolean
    },
    runtime: {
        type: Number
    },
    language: {
        required: true,
        type: String,
    },
    trailer: {
        type: String,
        required: true
    },
    cast: {
        required: true,
        type: [String]
    },
    director: {
        required: true,
        type: String
    },
})

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(50).required(),
        genreId: Joi.array().items(Joi.objectId().required()).min(1).required(),
        posterPath: Joi.string().required(),
        backdropPath: Joi.string().required(),
        releaseDate: Joi.string(),
        overview: Joi.string(),     
        ratedId: Joi.objectId().required(),
        isReleased: Joi.boolean().required(),
        runtime: Joi.number(),
        language: Joi.string().required(),
        trailer: Joi.string().required(),
        cast: Joi.array().items(Joi.string().required()).required(),
        director: Joi.string().required()
    });

    return schema.validate(movie);
}

function validateId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports.movieSchema = movieSchema;
module.exports.Movie = Movie;
module.exports.validate = validateMovie;
module.exports.validateId = validateId;