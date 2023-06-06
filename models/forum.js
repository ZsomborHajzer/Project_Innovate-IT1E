const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    question: {
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
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    }],
    votes: {
        type: Number,
        default: 0
    },
    tag: {
        type: String,
        default: "Other"
    }
}, { collection: 'Questions' });


const commentSchema = new Schema({
    comment: {
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
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }

}, { collection: 'Comments' });

const Question = mongoose.model('Question', questionSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Question, Comment };

