const express = require('express');
const router = express.Router();

//import controllers
const { getIndexPage } = require('../controllers/index');

// api routes
router.get('/', getIndexPage)

module.exports = router;