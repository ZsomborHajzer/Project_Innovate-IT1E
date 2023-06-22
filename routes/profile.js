const express = require('express');
const router = express.Router();

//import controllers
const { getProfilePage, patchPassword, patchName } = require('../controllers/profile');

//import middlewares
const isAuth = require('../middleware/is-auth');

// api routes
router.get('/', isAuth, getProfilePage);

router.patch('/', isAuth, patchPassword);

router.patch('/resetname', isAuth, patchName);



module.exports = router;