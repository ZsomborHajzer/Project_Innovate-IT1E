//Dependencies
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

//import models
const User = require('../models/user');

//import controllers
const authController = require('../controllers/auth');


//import middlewares
const isAuth = require('../middleware/is-auth');


// api routes


//BackEnd Validation Of Registration
router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage("Please enter a valid email!")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    console.log("user already in DB");
                    return Promise.reject("E-mail address already exists!");
                }
            })
        }).normalizeEmail({ gmail_remove_dots: false }),
    body('password').trim().isLength({ min: 5 }),
    body('firstName').trim().not().isEmpty(),
    body('lastName').trim().not().isEmpty()
], authController.signup);

router.post('/login', authController.login);


module.exports = router;