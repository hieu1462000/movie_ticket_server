const mongoose = require('mongoose');
const Joi = require('joi');


const MovieListSchema = mongoose.Schema({
    listName: {
        type: String,
        required: true
    },
    movies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Movie'
    }
});

const NowShowingList = mongoose.model('Now Showing', MovieListSchema);
const SpecialList = mongoose.model('Special', MovieListSchema);
const ComingSoonList = mongoose.model('Coming Soon', MovieListSchema);
  
function validateMovieList(snack) {
    const schema = Joi.object( {
        listName: Joi.string().required(),
        moviesId: Joi.array().items(Joi.objectId().required()).required()
    });
    
    return schema.validate(snack);
};

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports.NowShowingList = NowShowingList;
module.exports.SpecialList = SpecialList;
module.exports.ComingSoonList = ComingSoonList;
module.exports.validate = validateMovieList;
module.exports.validateId = validateId;