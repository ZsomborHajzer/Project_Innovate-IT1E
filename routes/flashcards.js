const express = require('express');
const router = express.Router();


//import models


//import controllers
const { getFlashcardsPage } = require('../controllers/flashcards');

//import middlewares


// api routes
router.get('/', getFlashcardsPage)

//Create a new set of 
router.put('/newSet',)

module.exports = router;