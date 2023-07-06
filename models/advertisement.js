const mongoose = require('mongoose');
const Joi = require('joi');

const advertisementSchema = mongoose.Schema({
  title: {
    type:String,
    required:true,
    minlength:3,
  },
  description: {
    type:String,
    required:true,
  },
  posterPath: {
    required: true,
    type: String
  }
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);
  
function validateAdvertisement(snack) {
    const schema = Joi.object( {
        title: Joi.string().min(3).required(),
        description: Joi.string().required(),
        posterPath: Joi.string().required()
    });
    
    return schema.validate(snack);
};

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports.Advertisement = Advertisement;
module.exports.validate = validateAdvertisement;
module.exports.validateId = validateId;