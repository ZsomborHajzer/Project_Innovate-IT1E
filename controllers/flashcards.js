//import models
const flashcardCollection = require('../models/flashcardCollection');

exports.getFlashcardsPage = async (req, res) => {
    res.status(200).json({
        message: 'Flashcards Is Working!',
    })
};

exports.getFlashcardsPage = (req, res, next) => {
    //Request all decks and respond in JSON
}