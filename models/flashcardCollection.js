//dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//FlashCardSchema
const flashcardSchema = new Schema({
    deckID: { type: Schema.Types.ObjectId, required: true },
    side1: { type: String, required: true },
    side2: { type: String, required: true }
})

//FlashCardSetSchema
const flashcardDeckSchema = new Schema({
    collectionID: { type: Schema.Types.ObjectId, required: true },
    setTitle: { type: String, required: true },
    flashcards: [flashcardSchema]
});

//FlashCard DB Schemas
const flashcardCollectionSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    decks: [flashcardDeckSchema]
}, { collection: "FlashcardCollection" });

//exports
module.exports = mongoose.model('FlashcardCollection', flashcardCollectionSchema);
module.exports = mongoose.model('FlashcardDecks', flashcardDeckSchema);
module.exports = mongoose.model('Flashcards', flashcardSchema);