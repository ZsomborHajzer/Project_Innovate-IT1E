//import models
const { validationResult } = require('express-validator');
const { flashcardCollection, flashcardDeck, flashcard } = require('../models/flashcardCollection');

exports.getFlashcardsPage = async (req, res) => {
    const collection = await flashcardCollection.findById({ _id: req.collectionId });

    if (collection === null) return res.status(404).json({ message: "No Collection found" });


    if (collection.decks.length == 0) {
        return res.json({ message: "No Decks" }).status(204);
    }


    let objArr = [];

    for (let i = 0; i < collection.decks.length; i++) {
        let returnedJson = {};
        let deckKey = "setTitle";
        let newValue = collection.decks[i].setTitle;
        let deckIdKey = "deckId";
        let deckIdValue = collection.decks[i]._id;
        returnedJson[deckKey] = newValue;
        returnedJson[deckIdKey] = deckIdValue;
        objArr.push(returnedJson);
    }
    res.status(201).json(objArr);
};

exports.getDeck = async (req, res) => {

    if (req.method === "GET") {
        try {
            deckId = req.query.deckId;

            if (deckId === null) {
                return res.status(400).json({ message: "No Deck ID was provided" })
            };

            const deck = await flashcardDeck.findById({ _id: deckId });

            if (deck === null) return res.status(400).json({ message: "No Deck found" });


            if (deck.flashcards.length == 0) {
                return res.json({ message: "No Flashcards" }).status(204);
            }
            let objArr = [];
            for (let i = 0; i < deck.flashcards.length; i++) {
                let returnedJson = {};
                let side1Key = `side1`;
                let side1Value = deck.flashcards[i].side1;
                let side2Key = `side2`;
                let side2Value = deck.flashcards[i].side2;
                let flashcardIdKey = "flashcardId";
                let flashcardIdValue = deck.flashcards[i]._id;
                returnedJson[side1Key] = side1Value;
                returnedJson[side2Key] = side2Value;
                returnedJson[flashcardIdKey] = flashcardIdValue;
                objArr.push(returnedJson);
            }
            res.status(201).json({ flashcards: objArr });
        } catch (err) {
            res.status(400).json({ message: "Deck not found" });
        }

    } else if (req.method === "DELETE") {

        try {
            const flashcardId = req.body.flashcardId;
            const deckId = req.query.deckId;
            await flashcard.findByIdAndDelete({ _id: flashcardId });
            await flashcardDeck.findOneAndUpdate({ _id: deckId }, { $pull: { flashcards: { _id: flashcardId } } });
            res.status(200).json({ message: "Flashcard Deleted" });
        } catch (err) {
            res.status(400).json({ message: "Flashcard not found" });
        }

    }
};

exports.newDeck = async (req, res) => {

    if (Object.keys(req.body).length === 0) {
        return res.status(418).json({ Message: "No Deck was created" })
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed.");
        error.statusCode = 400;
        error.data = errors.array();
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    const title = req.body.title;

    if (title === null || title === undefined || title === "") {
        title = "Title";
    }

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

