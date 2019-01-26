const mongoose = require('mongoose');

const ExerciseSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = {Exercise};
