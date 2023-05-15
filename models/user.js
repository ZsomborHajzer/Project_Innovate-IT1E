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
        default: "I am a new user"
    }
}, { collection: 'Users' });

module.exports = mongoose.model('User', userSchema);