const express = require('express');
const router = express.Router();


//import controllers
const { getHomePage } = require('../controllers/homePage');

//import middlewares


// api routes
router.get('/', getHomePage)

module.exports = router;