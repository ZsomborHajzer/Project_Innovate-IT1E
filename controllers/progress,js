//initialize express router
const express = require('express');
const { db } = require('../models/user');
const router = express.Router();

const User = require('../models/user');
const Assignements = db.collection('Assignments');


exports.getProgress = async (req, res) => {
    const userObj = await User.findOne({ _id: req.userId });
    console.log(userObj);

    const PHPcompleted = userObj.completedPHPAssigments.length;
    const JAVAcompleted = userObj.completedJAVAAssigments.length;
    const HTMLcompleted = userObj.completedHTMLCSSAssigments.length;

    const PHPavailable = await Assignements.findOne({ topic: "PHP" });
    const JAVAavailable = await Assignements.findOne({ topic: "JAVA" });
    const HTMLavailable = await Assignements.findOne({ topic: "HTML/CSS" });

    PHPAvailableQuestions = PHPavailable.questions.length;
    JAVAAvailableQuestions = JAVAavailable.questions.length;
    HTMLAvailableQuestions = HTMLavailable.questions.length;

    res.status(200).json({ "PHPComp": PHPcompleted, "PHPTotal": PHPAvailableQuestions, "JAVAComp": JAVAcompleted, "JAVATotal": JAVAAvailableQuestions, "HTMLComp": HTMLcompleted, "HTMLTotal": HTMLAvailableQuestions });

};