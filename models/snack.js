const mongoose = require('mongoose');
const Joi = require('joi');

const snackSchema = mongoose.Schema({
  title: {
    type:String,
    required:true,
    minlength:3,
    maxlength: 100
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type:String,
    required:true,
    minlength:3,
  },
  posterPath: {
    required: true,
    type: String
  }
});

const Snack = mongoose.model('Snack', snackSchema);
  
function validateSnack(snack) {
    const schema = Joi.object( {
        title: Joi.string().min(3).required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().min(3).required(),
        posterPath: Joi.string().required()
    });
    
    return schema.validate(snack);
};

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports.Snack = Snack;
module.exports.validate = validateSnack;
module.exports.validateId = validateId;