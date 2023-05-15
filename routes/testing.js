const express = require('express');
const router = express.Router();


//import controllers
const { getTesting } = require('../controllers/testing');

//import middlewares


// api routes
router.get('/', getTesting)

module.exports = router;