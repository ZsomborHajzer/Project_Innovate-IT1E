//import models
const { validationResult } = require('express-validator');
const { flashcardCollection, flashcardDeck, flashcard } = require('../models/flashcardCollection');

exports.getFlashcardsPage = async (req, res) => {
    res.status(200).json({
        message: 'Flashcards Is Working!',
    })
};

exports.newset = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const title = req.body.title;

    const deck = new flashcardDeck({
        collectionId: req.collectionId,
        setTitle: title,
        flashcards: []
    });
    deck.save();
    flashcardCollection.findOneAndUpdate({ _id: deck.collectionId }, { $push: { decks: deck.setTitle } });

    return res.status(201).json({ message: `Deck Successfully created`, deckID: deck._id });

    /* Cat.findOneAndUpdate({age: 17}, {$set:{name:"Naomi"}},function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    }

    console.log(doc);
}); */
}