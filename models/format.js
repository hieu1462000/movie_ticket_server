const mongoose = require('mongoose');
const Joi = require('joi');

const showtimeSchema = mongoose.Schema({
  time: {
      type: String,
      required: true
  },
});

const formatSchema = mongoose.Schema({
  name: {
    type:String,
    required:true,
    minlength:3,
  },
  seatPrice: {
    type:Number,
    required: true
  },
  tech: {
    required: true,
    type: String
  },
  showtimes: {
    type: [showtimeSchema],
    required: true
 }
});

const Format = mongoose.model('Format', formatSchema);
  
function validateFormat(format) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        seatPrice: Joi.number().required(),
        tech: Joi.string().required()
    });
    
    return schema.validate(format);
};

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports.formatSchema = formatSchema;
module.exports.Format = Format;
module.exports.validate = validateFormat;
module.exports.validateId = validateId;