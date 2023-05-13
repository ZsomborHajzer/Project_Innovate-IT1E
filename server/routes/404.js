const express = require('express');
const router = express.Router();


//import controllers
const { getErrorPage } = require('../controllers/404');

//import middlewares


// api routes
router.get('/', getErrorPage)

module.exports = router;