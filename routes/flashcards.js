const express = require('express');
const router = express.Router();


//import models
const User = require('../models/user');
const { flashcardCollection, flashcardDeck, flashcard } = require('../models/flashcardCollection');

//import middleware
const isAuth = require('../middleware/is-auth');


//import controllers
const { getFlashcardsPage, newDeck, updateDeck, deleteDeck, getDeck } = require('../controllers/flashcards');


// api routes
router.get('/', isAuth, getFlashcardsPage);

// route to get the flashcards from a specific deck
router.get('/getDeck', isAuth, getDeck)

// Route to delete a flashcard from a deck
router.delete('/getDeck', isAuth, getDeck)

//Create a new deck with flashcards
router.post('/newDeck', isAuth, newDeck);

//Update an existing deck
router.put('/updateDeck', isAuth, updateDeck)

//Delete a deck and its flashcards
router.delete('/deleteDeck', isAuth, deleteDeck)

module.exports = router;