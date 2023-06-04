// Import validator
const { validationResult } = require('express-validator');
//import models
const { Question, Comment } = require('../models/forum');
const User = require('../models/user');

exports.getForumPage = async (req, res) => {
    const questions = await Question.find();
    res.status(200).json({ questions: questions });
};

exports.getPost = async (req, res) => {

    if (req.method === "GET") {
        if (!req.query.questionId) return res.status(422).json({ message: "Invalid Input" });
        const questionId = req.query.questionId;
        const question = await Question.findById(questionId);
        if (question === null) return res.status(422).json({ message: "No Question in existence" });
        const comments = await Comment.find({ questionId: questionId });
        res.status(200).json({ question: question, comments: comments });

    } else if (req.method === "PATCH") {
        const userId = req.userId;
        const type = req.body.type;
        const id = req.body.id;
        const value = req.body.value;

        if (type === "question") {
            const existingVote = await User.findOne({ _id: userId, questionVotes: id });
            if (existingVote) return res.status(403).json({ message: "User has already voted on this post" });

            if (value === "1") {
                await Question.findOneAndUpdate({ _id: id }, { $inc: { votes: value } });
                await User.findOneAndUpdate({ _id: userId }, { $push: { questionVotes: id } });

            } else if (value === "-1") {
                await Question.findOneAndUpdate({ _id: id }, { $inc: { votes: value } });
                await User.findOneAndUpdate({ _id: userId }, { $push: { questionVotes: id } });
            };

        } else if (type === "comment") {
            const existingVote = await User.findOne({ _id: userId, commentVotes: id });
            if (existingVote) return res.status(403).json({ message: "User has already voted on this comment" });

            if (value === "1") {
                await Comment.findOneAndUpdate({ _id: id }, { $inc: { votes: value } });
                await User.findOneAndUpdate({ _id: userId }, { $push: { commentVotes: id } });

            } else if (value === "-1") {
                await Comment.findOneAndUpdate({ _id: id }, { $inc: { votes: value } });
                await User.findOneAndUpdate({ _id: userId }, { $push: { commentVotes: id } });
            };
        };
        res.status(200).json({ message: "Vote Updated" });
    };
}

exports.newPost = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: "Invalid Input" });
    }
    const question = req.body.question;
    const firstName = req.firstName;
    const lastName = req.lastName;
    const userId = req.userId;
    const tag = req.body.tag;
    const newQuestion = new Question({
        question: question,
        firstName: firstName,
        lastName: lastName,
        userId: userId,
        tag: tag
    });
    await newQuestion.save();
    res.status(201).json({ message: "Question Created" });
};

exports.newComment = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: "Invalid Input" });
    }
    const comment = req.body.comment;
    const questionId = req.body.questionId;
    const userId = req.userId;
    const fisrtName = req.firstName;
    const lastName = req.lastName;
    const newComment = new Comment({
        comment: comment,
        firstName: fisrtName,
        lastName: lastName,
        questionId: questionId,
        userId: userId
    });
    await newComment.save();
    await Question.findOneAndUpdate({ _id: questionId }, { $push: { comments: newComment._id } });
    res.status(201).json({ message: "Comment Created" });
};