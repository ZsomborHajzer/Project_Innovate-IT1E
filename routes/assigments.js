const express = require('express');
const router = express.Router();


//import controllers
const { getAssigment } = require('../controllers/assigments');

//import middlewares


// api routes
router.get('/', getAssigment)

module.exports = router;