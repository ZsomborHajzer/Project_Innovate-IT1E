//import models
const { validationResult } = require('express-validator');
const { flashcardCollection, flashcardDeck, flashcard } = require('../models/flashcardCollection');

/**
* * Get Flashcards Page takes in a token parameter of the collectionId, and returns the decks
 */

exports.getFlashcardsPage = async (req, res) => {
    const collection = await flashcardCollection.findById({ _id: req.collectionId });
    let returnedJson = {};

    if (collection.decks.length == 0) {
        return res.json({ message: "No Decks" }).status(204);
    }

    for (let i = 0; i < collection.decks.length; i++) {
        console.log(collection.decks[i].setTitle);
        let deckKey = "setTitle" + i;
        let newValue = collection.decks[i].setTitle;
        let deckIdKey = "deckId" + i;
        let deckIdValue = collection.decks[i]._id;
        returnedJson[deckKey] = newValue;
        returnedJson[deckIdKey] = deckIdValue;
    }
    res.status(201).json(returnedJson);
};

/**
 * * Get Deck takes in a query parameter of the deckId, and returns the deck with the flashcards
 */

exports.getDeck = async (req, res) => {

    if (!req.query.deckId) {
        return res.status(404).json({ message: "No Deck ID was provided" })
    };

    if (req.method === "GET") {
        const deck = await flashcardDeck.findById({ _id: req.query.deckId });
        let returnedJson = {};

        if (deck.flashcards.length == 0) {
            return res.json({ message: "No Flashcards" }).status(204);
        }

        for (let i = 0; i < deck.flashcards.length; i++) {
            let side1Key = `side1__${i}`;
            let side1Value = deck.flashcards[i].side1;
            let side2Key = `side2__${i}`;
            let side2Value = deck.flashcards[i].side2;
            let flashcardIdKey = "flashcardId" + i;
            let flashcardIdValue = deck.flashcards[i]._id;
            returnedJson[side1Key] = side1Value;
            returnedJson[side2Key] = side2Value;
            returnedJson[flashcardIdKey] = flashcardIdValue;
        }
        res.status(201).json(returnedJson);

    } else if (req.method === "DELETE") {
        const flashcardId = req.body.flashcardId;
        const deckId = req.query.deckId;
        await flashcard.findByIdAndDelete({ _id: flashcardId });
        await flashcardDeck.findOneAndUpdate({ _id: deckId }, { $pull: { flashcards: { _id: flashcardId } } });
        res.status(200).json({ message: "Flashcard Deleted" });
    }
};

/**
 * * New Deck takes in a request body that contains the title of the deck, and the flashcards
 * * The flashcards are in the form of an object, where the key is the side1, and the value is the side2
 * * The function creates a new deck, and then creates a new flashcard for each of the key value pairs
 */

exports.newDeck = async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(418).json({ Message: "No Deck was created" })
    }

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
        });
        await newFlashcard.save();
        await flashcardDeck.findByIdAndUpdate({ _id: newFlashcard.deckId }, { $push: { flashcards: newFlashcard } });
    }

    return res.status(201).json({ message: `Deck Successfully created`, deckID: deck._id });


};


/**
 * * Update deck checks the current flashcards, and compares them to the submitted ones. If they exist already, it leaves it alone
 * * If it exists, but was changed, updates the flashcard, and updates the nested flashcard in the deck as well.
 * * If it does not exist, it creates the flashcard then, it inserts it into the deck as a nested document.
 */

exports.updateDeck = async (req, res, next) => {
    let currentFlashcardsArr = [];
    let newFlashcardsArr = [];
    let deck = await flashcardDeck.findOne({ _id: req.query.deckId });
    const currentFlashcardCounter = deck.flashcards.length;
    const newFlashcardCounter = Object.keys(req.body).length;

    //sets the title if it was updated, if it was empty give it automatic name "Title"
    if (!req.body.title.length === 0) {
        if (deck.setTitle !== req.body.title) {
            await flashcardDeck.findOneAndUpdate({ _id: deck._id }, { $set: { setTitle: req.body.title } })
        }
    } else {
        await flashcardDeck.findOneAndUpdate({ _id: deck._id }, { $set: { setTitle: "Title" } })
    }

    // function to push all current flsahcards into array
    for (let i = 0; i < currentFlashcardCounter; i++) {
        currentFlashcardsArr.push(deck.flashcards[i].side1);
        currentFlashcardsArr.push(deck.flashcards[i].side2);
    }

    // function to push all recieved flashcards into array --- starts at 1 because of title obj
    for (let i = 1; i < newFlashcardCounter; i++) {
        newFlashcardsArr.push(Object.values(req.body)[i]);
    }
    let flashcardUpdateIndexId = [];

    // function to compare and replace items that do not match
    for (let i = 0; i < currentFlashcardsArr.length; i++) {
        if (currentFlashcardsArr[i] !== newFlashcardsArr[i]) {
            var j = Math.floor(i / 2);
            var flashcardObj = deck.flashcards[j];
            var flashcardID = deck.flashcards[j]._id;
            if ((i % 2 === 0)) {
                let fid = await flashcard.findOneAndUpdate({ _id: flashcardID, deckId: deck._id }, { $set: { side1: newFlashcardsArr[i] } });
                if (!flashcardUpdateIndexId.includes(fid._id)) {
                    flashcardUpdateIndexId.push(fid._id);
                }
            }
            if (i % 2 === 1) {
                let fid = await flashcard.findOneAndUpdate({ _id: flashcardID, deckId: deck._id }, { $set: { side2: newFlashcardsArr[i] } });
                if (!flashcardUpdateIndexId.includes(fid._id)) {
                    flashcardUpdateIndexId.push(fid._id);
                }
            }
        }
    }

    //Check on all the updated flashcards, and also update the flashcards that are nested in the deck
    for (let i = 0; i < flashcardUpdateIndexId.length; i++) {
        let loadedFlashcard = await flashcard.findById(flashcardUpdateIndexId[i]);
        await flashcardDeck.findOneAndUpdate({ _id: deck._id, 'flashcards._id': loadedFlashcard._id }, { $set: { 'flashcards.$': loadedFlashcard } }, { new: true });
    }

    //if the user added further flashcards, create them and add them to the deck

    if (currentFlashcardsArr.length < newFlashcardsArr.length) {
        for (let i = currentFlashcardsArr.length; i < newFlashcardsArr.length; i += 2) {
            const side1 = Object.values(req.body)[i];
            const side2 = Object.values(req.body)[i + 1];

            const newFlashcard = new flashcard({
                deckId: deck._id,
                side1: side1,
                side2: side2
            });
            await newFlashcard.save();
            await flashcardDeck.findByIdAndUpdate({ _id: newFlashcard.deckId }, { $push: { flashcards: newFlashcard } });
        }
    }
    return res.status(200).json({ "message": "Updated Successfuly" });
}

/**
 * * Delete Deck takes in a query parameter of the deckId, and deletes the deck and all of its flashcards
 */

exports.deleteDeck = async (req, res, next) => {
    let deckId = req.query.deckId;
    let collectionId = req.collectionId;
    let deck = await flashcardDeck.findOneAndDelete({ _id: deckId });
    for (let i = 0; i < deck.flashcards.length; i++) {
        await flashcard.findOneAndDelete({ _id: deck.flashcards[i]._id });
    }
    await flashcardCollection.findOneAndUpdate({ _id: collectionId }, { $pull: { decks: { _id: deckId } } });
    res.status(200).json({ "message": "Deleted Successfuly" });
}

/**
 * 
 * ! Need to figure out if we want to save created flashcards seperately or inside all one nested document
 * 
 */
