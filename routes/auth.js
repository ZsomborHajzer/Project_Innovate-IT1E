const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

//import models
const User = require('../models/user');


//import controllers
const { getSignUp } = require('../controllers/auth.js');


//import middlewares


// api routes
router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage("Please enter a valid email!")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject("E-mail address already exists!");
                }
            })
        }).normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('firstName').trim().not().isEmpty(),
    body('lastName').trim().not().isEmpty()
]);

module.exports = router;