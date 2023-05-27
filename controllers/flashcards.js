//import models
const { validationResult } = require('express-validator');
const { flashcardCollection, flashcardDeck, flashcard } = require('../models/flashcardCollection');

exports.getFlashcardsPage = async (req, res) => {
    const collection = await flashcardCollection.findById({ _id: req.collectionId });
    let returnedJson = {};
    if (collection.decks.length === 0) {
        res.status(204)
    }
    for (let i = 0; i < collection.decks.length; i++) {
        console.log(collection.decks[i].setTitle);
        var deckKey = "setTitle" + i;
        var newValue = collection.decks[i].setTitle;
        returnedJson[deckKey] = newValue;
    }
    res.status(201).json(returnedJson);
};

exports.newset = async (req, res) => {
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
    await deck.save();
    await flashcardCollection.findOneAndUpdate({ _id: deck.collectionId }, { $push: { decks: deck } });

    for (let i = 1; i < Object.values(req.body).length; i += 2) {
        const side1 = Object.values(req.body)[i];
        const side2 = Object.values(req.body)[i + 1];

        const newFlashcard = new flashcard({
            deckId: deck._id,
            side1: side1,
            side2: side2
        })
        await newFlashcard.save();
        await flashcardDeck.findByIdAndUpdate({ _id: newFlashcard.deckId }, { $push: { flashcards: newFlashcard } })
        //await flashcardCollection.findByIdAndUpdate({})
        //maybe update the collection that contains the deck as well
    }

    return res.status(201).json({ message: `Deck Successfully created`, deckID: deck._id });

}