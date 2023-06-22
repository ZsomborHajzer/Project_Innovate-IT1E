//initialize express router
const express = require('express');
const router = express.Router();
const { db } = require("../models/user");
const User = require('../models/user');

const Achievements = db.collection('Achievements');

exports.getAllAchievements = async (req, res) => {
    const achievementObj = await Achievements.find().toArray();

    if (achievementObj === null) return res.status(400).json({ message: "Achievements not found" });
    res.status(200).json({ Achievements: achievementObj });
}

exports.getunlockedAchievement = async (req, res) => {
    const userObj = await User.findOne({ _id: req.userId });

    if (userObj === null) return res.status(400).json({ message: "User not found" });
    const achievementsUnlocked = userObj.achievementsUnlocked;
    res.status(200).json({ "achievementsUnlocked": achievementsUnlocked });
}