const express = require('express');
const router = express.Router();

//import models

//import middleware
const isAuth = require('../middleware/is-auth');

//import controllers
const { getTestGenerationPage, postTestGenerationPage } = require('../controllers/forum');

router.get('/', isAuth, getTestGenerationPage);

router.post('/generatedTest', isAuth, postTestGenerationPage);




module.exports = router;