const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    flashcards: [{
        type: String,
        required: false
    }],
    achievements: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);