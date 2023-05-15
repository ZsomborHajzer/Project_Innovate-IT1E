//dependencies
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//import models
const User = require('../models/user');


exports.getSignUp = async (req, res) => {
    res.status(200).json({
        message: 'Sign Up page is working',
    })
};

// get info from body + error validate + create new user + passwordhash + store in database
exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });
        return user.save();
    })
        .then(result => {
            res.status(201).json({ message: "User succesfully created!", userId: result._id })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//Request email, password -> find user with email -> if no user throw error -> get password -> decrypt and compare -> if false throw error -> if true generate JWT token
//JWT secret == JWTSECRETKEY , Expires in 1 hour
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email }).then(user => {
        if (!user) {
            const error = new Error('A user with this email does not exist');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error("Wrong Password");
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({ email: loadedUser.email, userId: loadedUser._id.toString() }, 'JWTSECRETTOKEN', { expiresIn: '2h' });
            res.status(200).json({ token: token, userId: loadedUser._id.toString() })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}