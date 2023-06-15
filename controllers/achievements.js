//initialize express router
const express = require('express');
const router = express.Router();
const {db} = require("../models/user");
const User = require('../models/user');
const Achievements = db.collection('Achievements');

// Based on the user's progress, achievements are unlocked
exports.getAchievements = async (req, res) => {
    const userObj = await User.findOne({ _id: req.userId });
    const achievementsUnlocked = userObj.achievementsUnlocked;
    

    console.log(allAchievements.toArray());
    res.status(200).json({ "achievementsUnlocked": achievementsUnlocked });
    if (userObj.completedPHPAssigments.length === 1) {  
        await User.findOneAndUpdate({ _id: req.userId }, { $push: { achievementsUnlocked: phpAchievement } });
      } else if(userObj.completedJAVAssigments.length === 1){
        await User.findOneAndUpdate({ _id: req.userId }, { $push: { achievementsUnlocked: javaAchievement } });
      } else if(userObj.completedHTMLCSSAssigments.length === 1){
        await User.findOneAndUpdate({ _id: req.userId }, { $push: { achievementsUnlocked: htmlAchievement } });
      } else


    if(achievementsUnlocked.length === 0){
        res.status(204).json({message: "No achievements unlocked"});
        return;
    }
}

    exports.checkAchievement = async (req, res) => {

    const phpAchievement = await Achievements.findOne({topic: "PHP1"});
    const javaAchievement = await Achievements.findOne({topic: "JAVA1"});
    const htmlAchievement = await Achievements.findOne({topic: "HTML/CSS1"});

    if(userObj.achievementsUnlocked.includes(phpAchievement)){
        res.status(200).json({message: "Achievement already unlocked"});
        return;
    }
}