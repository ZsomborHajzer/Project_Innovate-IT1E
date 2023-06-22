const express = require('express');
const router = express.Router();


//import controllers
const { getAllAchievements, getunlockedAchievement, unlockAchievements } = require('../controllers/achievements');

//import middlewares
const isAuth = require('../middleware/is-auth');


// api routes
router.get('/', isAuth, getAllAchievements);

router.get('/unlockedAchievement', isAuth, getunlockedAchievement);

module.exports = router;
