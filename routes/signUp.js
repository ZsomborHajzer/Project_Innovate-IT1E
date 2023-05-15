const express = require('express');
const router = express.Router();


//import controllers
const { getSignUp } = require('../controllers/signUp');

//import middlewares


// api routes
router.get('/', getSignUp)

module.exports = router;