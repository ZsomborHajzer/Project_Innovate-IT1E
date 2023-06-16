//dependencies
const jwt = require('jsonwebtoken');

//middleware
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new Error('Not authennticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'JWTSECRETTOKEN');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    req.collectionId = decodedToken.collectionId;
    req.firstName = decodedToken.firstName;
    req.lastName = decodedToken.lastName;
    req.email = decodedToken.email;
    next();
};