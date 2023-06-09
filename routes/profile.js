const express = require('express');
const router = express.Router();


//import controllers
const { getProfilePage, patchPassword } = require('../controllers/profile');

//import middlewares
const isAuth = require('../middleware/is-auth');


// api routes
//isAuth currently breaks this since i am not sure how to use it in postman to test it
router.get('/', isAuth, getProfilePage);

router.patch('/', isAuth, patchPassword);


module.exports = router;