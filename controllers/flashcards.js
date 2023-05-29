//import models
const { validationResult } = require('express-validator');
const { flashcardCollection, flashcardDeck, flashcard } = require('../models/flashcardCollection');

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
 * TODO: Updatedeck needs to be able to update a deck with new cards. This could be done by either deleting all the previous cards and saving all of the new ones all over again, or it 
 *  TODO: it could be done also by recording all current cards in an array -> recording all the submitted ones in an array as well -> comparing the two array by indicies and if they differ delete/create new ones in the database 
 */

exports.updateDeck = async (req, res, next) => {
    let currentFlashcardsArr = [];
    let newFlashcardsArr = [];
    let deck = await flashcardDeck.findById("6473a1f3221e4f7d03f7e8f8");
    const currentFlashcardCounter = deck.flashcards.length;
    const newFlashcardCounter = Object.keys(req.body).length;


    // function to push all current flsahcards into array
    for (let i = 0; i < currentFlashcardCounter; i++) {
        currentFlashcardsArr.push(deck.flashcards[i].side1);
        currentFlashcardsArr.push(deck.flashcards[i].side2);
    }

    // function to push all recieved flashcards into array --- starts at 1 because of title obj
    for (let i = 1; i < newFlashcardCounter; i++) {
        newFlashcardsArr.push(Object.values(req.body)[i]);
    }

    // function to compare and replace items that do not match
    for (let i = 0; i < currentFlashcardsArr.length; i++) {
        if (currentFlashcardsArr[i] !== newFlashcardsArr[i]) {
            if (i % 2 === 0 || i === 0) {
                //query here to update items in db for flashcard side1
                flashcardDeck.updateOne({ _id: deck._id }, { $set: { flashcards[Math.floor(i / 2)].side1: newFlashcardsArr[i]} });
                console.log(newFlashcardsArr[i] + '--side1');
            } else {
                //query here to update items in db for flashcard side1
                console.log(newFlashcardsArr[i] + '--side2');
            }

        } else {
            console.log(currentFlashcardsArr[i] + "..................");
        }
    }
    //Contact.update({phone:request.phone}, {$set: { phone: request.phone }}, {upsert: true}, function(err){...})
    //console.log(currentFlashcardsArr);
    //console.log(newFlashcardsArr);
    return res.status(204);
};


exports.deleteDeck = async (req, res, next) => {
    res.status(204);
}

/**
 * 
 * ! Need to figure out if we want to save created flashcards seperately or inside all one nested document
 * 
 */
