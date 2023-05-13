const express = require('express');
const router = express.Router();


//import controllers
const { getProfilePage } = require('../controllers/profile');

//import middlewares


// api routes
router.get('/', getProfilePage)

module.exports = router;