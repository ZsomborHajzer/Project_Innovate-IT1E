const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

//import models
const User = require('../models/user');


//import controllers
const authController = require('../controllers/auth');


//import middlewares


// api routes

//BackEnd Validation
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
], authController.signup);

module.exports = router;