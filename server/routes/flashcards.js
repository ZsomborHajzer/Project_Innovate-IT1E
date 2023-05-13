const express = require('express');
const router = express.Router();


//import controllers
const { getFlashcardsPage } = require('../controllers/flashcards');

//import middlewares


// api routes
router.get('/', getFlashcardsPage)


module.exports = router;