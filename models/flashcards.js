//dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema
const flashcardsSchema = new Schema({

}, { collection: "Flashcards" });

//exports
module.exports = mongoose.model('Flashcards', flashcardsSchema);