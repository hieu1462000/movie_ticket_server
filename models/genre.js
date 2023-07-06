const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = mongoose.Schema({
  name: {
    type:String,
    required:true,
    minlength:3,
    maxlength: 50
  }
});

const Genre = mongoose.model('Genre', genreSchema);
  
function validateGenre(genre) {
    const schema = Joi.object( {
        name: Joi.string().min(3).required()
    });
    
    return schema.validate(genre);
};

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;
module.exports.validateId = validateId;