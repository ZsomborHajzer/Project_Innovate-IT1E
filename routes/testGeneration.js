const express = require('express');
const router = express.Router();

//import middleware
const isAuth = require('../middleware/is-auth');

//import controllers
const { getTestGenerationPage } = require('../controllers/testGeneration');

router.get('/', isAuth, getTestGenerationPage);

module.exports = router;