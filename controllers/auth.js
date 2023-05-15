const User = require('../models/user');


exports.getSignUp = async (req, res) => {
    res.status(200).json({
        message: 'Sign Up page is working',
    })
};

exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
};