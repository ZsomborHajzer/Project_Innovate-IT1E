//import models and dependencies
const User = require('../models/user');

//import dependencies
const bcrypt = require('bcryptjs');

exports.getProfilePage = async (req, res) => {
    const firstName = req.firstName;
    const lastName = req.lastName;
    const email = req.email;
    res.status(201).json({ firstName: firstName, lastName: lastName, email: email });
};

exports.patchPassword = async (req, res) => {

    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const user = await User.findById({ _id: req.userId });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isEqual = await bcrypt.compare(currentPassword, user.password);

    if (!isEqual) {
        return res.status(400).json({ message: "Incorrect Password" });
    };

    if (currentPassword === newPassword) {
        return res.status(400).json({ message: "New Password cannot be the same as the old password" });
    };

    if (newPassword.length < 5) {
        return res.status(400).json({ message: "New Password must be at least 5 characters long" });
    };
    const hashedPassword = await bcrypt.hash(newPassword.trim(), 12);
    await User.findByIdAndUpdate({ _id: req.userId }, { $set: { password: hashedPassword } });
    res.status(201).json({ message: "Password Changed" });
};