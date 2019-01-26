const mongoose = require('mongoose');

// const User = new mongoose.model('User', {
//     username: {
//         type: String
//     },
//     userId: {
//         type: Number
//     }
// });

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
