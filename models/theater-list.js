const mongoose = require('mongoose');
const Joi = require('joi');

const TheaterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    times: {
        type: [String],
        required: true
    }
})

const TheaterListSchema = mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    theaters: {
        type: [TheaterSchema],
        required: true
    }
});

const TheaterList = mongoose.model('Theater List', TheaterListSchema);


function validateTheaterList(snack) {
    const schema = Joi.object({
        date: Joi.string().required(),
    });

    return schema.validate(snack);
};

function validateId(id) {
    return mongoose.Types.ObjectId.isValid(id);
};

module.exports.TheaterList = TheaterList;
module.exports.validate = validateTheaterList;
module.exports.validateId = validateId;