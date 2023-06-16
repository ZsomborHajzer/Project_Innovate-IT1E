const express = require('express');
const router = express.Router();

//import controllers
const { getAssigment, getSpecificAssigment, getNumberOfQuestions } = require('../controllers/assignments');

//import middlewares
const isAuth = require('../middleware/is-auth');

// api routes
router.get('/', isAuth, getAssigment);

router.get('/specificAssignement', isAuth, getSpecificAssigment);

router.patch('/specificAssignement', isAuth, getSpecificAssigment);

router.get('/numberOfQuestions', isAuth, getNumberOfQuestions);

module.exports = router;