const express = require('express');
const router = express.Router();


//import controllers
const { getAchievements } = require('../controllers/achievements');

//import middlewares
const isAuth = require('../middleware/is-auth');


// api routes
router.get('/', isAuth, getAchievements);


module.exports = router;
