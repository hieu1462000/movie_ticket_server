const mongoose = require('mongoose');
const Joi = require('joi');

const ratedSchema = mongoose.Schema({
  symbol: {
    type:String,
    required:true,
    enum: ['C18', 'C16', 'C13', "P", "K"]
  },
  description: {
    type:String,
    required: true,
    minlength: 10
  },
});

const Rated = mongoose.model('Rated', ratedSchema);
  
function validateRated(rated) {
    const schema = Joi.object( {
        symbol: Joi.string().required(),
        description: Joi.string().min(10).required(),
    });
    
    return schema.validate(rated);
};

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports.ratedSchema = ratedSchema;
module.exports.Rated = Rated;
module.exports.validate = validateRated;
module.exports.validateId = validateId;