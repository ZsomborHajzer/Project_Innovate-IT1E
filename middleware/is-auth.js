//dependencies
const jwt = require('jsonwebtoken');

//middleware
//This is a middleware that can be used on any get request to verify if the user is logged in or not.
//To use it just import it in one of the routes file, and insert it as a middleware
//it requires an Authorization header from frontend in the style Key: Authorization .. Value: Bearer (JWT here) 
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
    next();
};