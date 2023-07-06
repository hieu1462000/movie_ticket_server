const mongoose = require('mongoose');
const Joi = require('joi');

const recommendedSchema = mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    posterPath: {
        required: true,
        type: String
    }
});

const Recommended = mongoose.model('Recommended', recommendedSchema);

function validateRecommended(recommended) {
    const schema = Joi.object({
        _id: Joi.objectId().required(),
        type: Joi.string().required(),
        posterPath: Joi.string().required()
    });

    return schema.validate(recommended);
};

function validateId(id) {
    return mongoose.Types.ObjectId.isValid(id);
};

module.exports.Recommended = Recommended;
module.exports.validate = validateRecommended;
module.exports.validateId = validateId;