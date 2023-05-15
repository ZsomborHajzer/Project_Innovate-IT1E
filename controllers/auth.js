const User = require('../models/user');
const { validationResult } = require('express-validator');


exports.getSignUp = async (req, res) => {
    res.status(200).json({
        message: 'Sign Up page is working',
    })
};

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed.");
        error.statusCode = 422;
        error.data = errors, array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
};