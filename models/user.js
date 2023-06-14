//dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema
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
    questionVotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: false
    }],
    commentVotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    }],
    completedPHPAssigments: [String],
    completedJAVAAssigments: [String],
    completedHTMLCSSAssigments: [String],

    achievementsUnlocked: [String],

}, { collection: 'Users' });

//export
module.exports = mongoose.model('User', userSchema);