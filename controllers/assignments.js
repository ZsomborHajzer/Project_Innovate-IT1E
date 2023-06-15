//initialize express router
const express = require('express');
const { db } = require('../models/user');
const router = express.Router();

//import DB 
const Assignments = db.collection('Assignments')

exports.getAssigment = async (req, res) => {
    const chosenTopic = req.query.topic;
    const assignmentObj = await Assignments.findOne({ topic: chosenTopic });
    res.status(200).json({ assignments: assignmentObj.questions });
};

exports.getSpecificAssigment = async (req, res) => {
    const topic = req.query.topic;
    const questionNum = req.query.questionNum;
    const questionObj = await Assignments.findOne({ topic: topic });

    for (let i = 0; i < questionObj.questions.length; i++) {
        if (questionObj.questions[i].questionNum === questionNum) {
            res.status(200).json({ question: questionObj.questions[i] });
            return;
        }
    }
    res.status(404).json({ message: "Question not found" });
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