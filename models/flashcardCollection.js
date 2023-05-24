//dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//FlashCardSchema
const flashcardSchema = new Schema({
    deckID: { type: Schema.Types.ObjectId, required: true },
    side1: { type: String, required: true },
    side2: { type: String, required: true }
}, { collection: "Flashcards" })

//FlashCardSetSchema
const flashcardDeckSchema = new Schema({
    collectionID: { type: Schema.Types.ObjectId, required: true },
    setTitle: { type: String, required: true },
    flashcards: [flashcardSchema]
}, { collection: "Decks" });

//FlashCard DB Schemas
const flashcardCollectionSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    decks: [flashcardDeckSchema]
}, { collection: "FlashcardCollection" });

//exports
const flashcardCollection = mongoose.model('FlashcardCollection', flashcardCollectionSchema);
const flashcardDeck = mongoose.model('FlashcardDecks', flashcardDeckSchema);
const flashcard = mongoose.model('Flashcards', flashcardSchema);

module.exports = { flashcardCollection, flashcardDeck, flashcard }