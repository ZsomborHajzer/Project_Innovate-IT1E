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
    res.status(200).json({ assignments: assignmentObj.questions });
};

exports.getSpecificAssigment = async (req, res) => {

    if (req.method === "GET") {
        const topic = req.body.topic;
        const questionNum = req.body.questionNum;
        const questionObj = await Assignments.findOne({ topic: topic });

        for (let i = 0; i < questionObj.questions.length; i++) {

            if (questionObj.questions[i].questionNum === questionNum) {
                res.status(200).json({ question: questionObj.questions[i] });
                return;
            }
        }
        res.status(404).json({ message: "Question not found" });
    }

    if (req.method === "PATCH") {
        const topic = req.body.topic;
        const title = req.body.title;
        const completed = req.body.completed;

        if (topic === "PHP") {
            const userObj = await User.findOne({ _id: req.userId });

            if (userObj.completedPHPAssigments.includes(title)) {
                res.status(200).json({ message: "Already completed this assignment" });
                return;
            }

            await User.findOneAndUpdate({ _id: req.userId }, { $push: { completedPHPAssigments: title } });
            res.status(200).json({ message: "Assignment completed" });

        } else if (topic === "JAVA") {
            const userObj = await User.findOne({ _id: req.userId });
            if (userObj.completedJAVAAssigments.includes(title)) {
                res.status(200).json({ message: "Already completed this assignment" });
                return;
            }

            await User.findOneAndUpdate({ _id: req.userId }, { $push: { completedJAVAAssigments: title } });
            res.status(200).json({ message: "Assignment completed" });

        } else if (topic === "HTML/CSS") {
            const userObj = await User.findOne({ _id: req.userId });

            if (userObj.completedHTMLCSSAssigments.includes(title)) {
                res.status(200).json({ message: "Already completed this assignment" });
                return;
            }

            await User.findOneAndUpdate({ _id: req.userId }, { $push: { completedHTMLCSSAssigments: title } });
            res.status(200).json({ message: "Assignment completed" });
        }
        res.status(404).json({ message: "Assignment not found" });
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
}