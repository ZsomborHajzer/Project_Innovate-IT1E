//initialize express router
const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Achievements = db.collection('Achievements');

// Based on the user's progress, achievements are unlocked
exports.getAchievements = async (req, res) => {
    const userObj = await User.findOne({ _id: req.userId });
    const allAchievements = await Achievements.find({});
    const achievementsUnlocked = userObj.achievementsUnlocked;
    console.log(allAchievements.toArray());
    res.status(200).json({ "achievementsUnlocked": achievementsUnlocked });
         

    if(achievementsUnlocked.length === 0){
        res.status(204).json({message: "No achievements unlocked"});
        return;
    }





};