const mongoose = require('mongoose');

mongoose.promise = global.promise;

mongoose.connect("mongodb://localhost:27017/ExerciseTracker", {
    useNewUrlParser: true
});

module.exports = {mongoose};
