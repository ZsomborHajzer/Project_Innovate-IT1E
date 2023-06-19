const express = require('express');
const router = express.Router();

//import controllers
console.log('Hey HEY HEY');
const { getProgress } = require('../controllers/progress');
console.log('AYAYAYAYA');
//import middlewares
const isAuth = require('../middleware/is-auth');

// api routes
router.get('/', isAuth, getProgress);

module.exports = router;