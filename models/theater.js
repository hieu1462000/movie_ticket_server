const mongoose = require('mongoose');
const Joi = require('joi');

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
  },
  times: {
    type: [String],
    required: true
  }
});

const Theater = mongoose.model('Theater', theaterSchema);
  
function validateTheater(theater) {
    const schema = Joi.object( {
        name: Joi.string().min(3).required(),
        numberOfSeat: Joi.number().required(),
        numberOfRow: Joi.number().required(),
        numberOfColumn: Joi.number().required(),
        times: Joi.array().items(Joi.string().required()).required()
    });
    
    return schema.validate(theater);
};

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports.theaterSchema = theaterSchema;
module.exports.Theater = Theater;
module.exports.validate = validateTheater;
module.exports.validateId = validateId;