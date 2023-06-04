const express = require('express');
const router = express.Router();

//import models

//import middleware
const isAuth = require('../middleware/is-auth');

//import controllers
const { getForumPage, getPost, newPost, newComment } = require('../controllers/forum');

// api routes

//main forum page
router.get('/', isAuth, getForumPage);

//get a specific post
router.get('/getPost', isAuth, getPost);

//create a new post
router.put('/newPost', isAuth, newPost);

//create a new comment
router.put('/newComment', isAuth, newComment);


//export router
module.exports = router;
