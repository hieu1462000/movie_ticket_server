const mongoose = require('mongoose');
const Joi = require('joi');
const {formatSchema} = require("./format")

const ratedSchema = mongoose.Schema({
    symbol: {
        type:String,
        required:true,
        enum: ['C18', 'C16', 'C13', "P", "K"]
    },
})

const movieSchema = mongoose.Schema({
    title:{
        required:true,
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    rated: {
        required: true,
        type: ratedSchema,
    }
});


const showtimeManagementSchema = mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    formats: {
        type: [formatSchema],
        required: true
    }
});

const ShowtimeManagement = mongoose.model('Showtime Management', showtimeManagementSchema);
  
function validateShowtimeManagement(Showtime) {
    const schema = Joi.object({
        date: Joi.string().required(),
        movieId: Joi.objectId().required(),
        formatId: Joi.array().items(Joi.objectId().required()).required()
    });
    
    return schema.validate(Showtime);
};

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports.showtimeManagementSchema = showtimeManagementSchema;
module.exports.ShowtimeManagement = ShowtimeManagement;
module.exports.validate = validateShowtimeManagement;
module.exports.validateId = validateId;