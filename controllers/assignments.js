//initialize express router
const express = require('express');
const { db } = require('../models/user');
const router = express.Router();

//import DB 
const User = require('../models/user');
const Assignments = db.collection('Assignments')

exports.getAssigment = async (req, res) => {
    const chosenTopic = req.body.topic;
    const assignmentObj = await Assignments.findOne({ topic: chosenTopic });
    console.log(assignmentObj.questions);
    res.status(200).json({ assignments: assignmentObj.questions });
};

exports.getSpecificAssigment = async (req, res) => {
    /*if user sends something to show that the assignement was finished, eg: {
        "topic": "PHP",
        "title": "PHP assignement title"
        "assigment" : "completed"
    }
    update the database of the user so that we save the question title to the correct dataset.
    */

    if (req.method === "GET") {
        const topic = req.body.topic;
        const questionNum = req.body.questionNum;
        const questionObj = await Assignments.findOne({ topic: topic });

        for (let i = 0; i < questionObj.questions.length; i++) {
            if (questionObj.questions[i].questionNum === questionNum) {
                console.log(questionObj.questions[i].question);
                res.status(200).json({ question: questionObj.questions[i] });
                return;
            }
        }
        res.status(404).json({ message: "Question not found" });
    }

    if (req.method === "patch") {
        req.status(200).json({ "message": "YEET" });
    }

};

exports.getNumberOfQuestions = async (req, res) => {
    const PHPObj = await Assignments.findOne({ topic: "PHP" });
    const JAVAObj = await Assignments.findOne({ topic: "JAVA" });
    const HTMLObj = await Assignments.findOne({ topic: "HTML/CSS" });

    const PHPNum = PHPObj.questions.length;
    const JAVANum = JAVAObj.questions.length;
    const HTMLNum = HTMLObj.questions.length;

    res.status(200).json({ PHPNum: PHPNum, JAVANum: JAVANum, HTMLNum: HTMLNum });
};