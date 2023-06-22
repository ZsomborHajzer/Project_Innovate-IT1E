
const express = require('express');
const router = express.Router();

//import controllers
const { getProgress } = require('../controllers/progress');

//import middlewares
const isAuth = require('../middleware/is-auth');

// api routes
router.get('/', isAuth, getProgress);

module.exports = router;

