const express = require('express');
const router = express.Router();


//import models
const User = require('../models/user');
const { flashcardCollection, flashcardDeck, flashcard } = require('../models/flashcardCollection');

//import middleware
const isAuth = require('../middleware/is-auth');


//import controllers
const { getFlashcardsPage, newset } = require('../controllers/flashcards');


// api routes
router.get('/', getFlashcardsPage);

//Create a new set of 
router.put('/newset', isAuth, newset);

module.exports = router;