//import models
const { validationResult } = require('express-validator');
const { flashcardCollection, flashcardDeck, flashcard } = require('../models/flashcardCollection');
const { findByIdAndDelete } = require('../models/user');

/**
 * 
 * TODO: I also need to return a deckID value for each of the fetched decks which will allow the front end ppl to
 * TODO: assign ID to each of the deck buttons, and therefore whenever they click on a deck they can redirect to the update page and
 * TODO: an ID number so i know which deck to fetch from the user
 *  
 */

exports.getFlashcardsPage = async (req, res) => {
    const collection = await flashcardCollection.findById({ _id: req.collectionId });
    let returnedJson = {};
    if (collection.decks.length == 0) {
        return res.json({ message: "No Decks" }).status(204);
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
        //await flashcardCollection.findByIdAndUpdate({})
        //maybe update the collection that contains the deck as well
    }

    return res.status(201).json({ message: `Deck Successfully created`, deckID: deck._id });


};

/**
 * TODO: Updatable Title
 * TODO: Get deck by ID from the URL.  -> I need to send the ID numbers of each fetched deck on the flashcards/ page, so that front-end can assigne it to eachbutton.
 * TODO: When the button is Pressed it will put the deckID in the URL, from which I can request it and choose the deck based on that. 
 */

/**
 * * Update deck checks the current flashcards, and compares them to the submitted ones. If they exist already, it leaves it alone
 * * If it exists, but was changed, updates the flashcard, and updates the nested flashcard in the deck as well.
 * * If it does not exist, it creates the flashcard then, it inserts it into the deck as a nested document.
 */

exports.updateDeck = async (req, res, next) => {
    let currentFlashcardsArr = [];
    let newFlashcardsArr = [];
    let deck = await flashcardDeck.findOne({ _id: '647a814c1612567ed09f1989' });
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
    console.log(currentFlashcardsArr);
    console.log(newFlashcardsArr);

    let flashcardUpdateIndexId = [];

    // function to compare and replace items that do not match
    for (let i = 0; i < currentFlashcardsArr.length; i++) {
        if (currentFlashcardsArr[i] !== newFlashcardsArr[i]) {
            var j = Math.floor(i / 2);
            var flashcardObj = deck.flashcards[j];
            var flashcardID = deck.flashcards[j]._id;
            if ((i % 2 === 0)) {
                let fid = await flashcard.findOneAndUpdate({ _id: flashcardID, deckId: deck._id }, { $set: { side1: newFlashcardsArr[i] } });
                //    allPromises.push(flashcardDeck.findOneAndUpdate({ _id: deck._id, flashcards: flashcardObj }, { $set: { 'flashcards.$.side1': newFlashcardsArr[i] } }));
                if (!flashcardUpdateIndexId.includes(fid._id)) {
                    flashcardUpdateIndexId.push(fid._id);
                }
            }
            if (i % 2 === 1) {
                let fid = await flashcard.findOneAndUpdate({ _id: flashcardID, deckId: deck._id }, { $set: { side2: newFlashcardsArr[i] } });
                //    allPromises.push(flashcardDeck.findOneAndUpdate({ _id: deck._id, flashcards: flashcardObj }, { $set: { 'flashcards.$.side2': newFlashcardsArr[i] } }));
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


exports.deleteDeck = async (req, res, next) => {
    res.status(204);
}

/**
 * 
 * ! Need to figure out if we want to save created flashcards seperately or inside all one nested document
 * 
 */
