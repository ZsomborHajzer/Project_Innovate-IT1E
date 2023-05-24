//import models
const { validationResult } = require('express-validator');
const { flashcardCollection, flashcardDeck, flashcard } = require('../models/flashcardCollection');

exports.getFlashcardsPage = async (req, res) => {
    res.status(200).json({
        message: 'Flashcards Is Working!',
    })
};

exports.newset = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const title = req.body.title;
    const userID = req.userID;

    const deck = new flashcardDeck({
        userID: userID,

    })
}