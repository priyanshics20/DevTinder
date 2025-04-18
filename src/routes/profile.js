// profileRouter
// GET /profile/view
// PATCH /profile/edit
// PATCH /profile/password  // Forgot password API

const express = require("express");
const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");
const validator = require("validator")
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/profile/view", userAuth ,async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})
// patch api was not working at client side (due to some cors issue)
router.put("/profile/edit", userAuth, async (req, res) => {
    try {
        // validate the fields
        if (!validateEditProfileData(req)) {
            throw new Error ("Invalid fields in update Profile")
        }

        // userAAuth is sending the user details so don't need to find again from the DB
        const loggedInUser = req.user;

        // coming from client side (request body )
        const requestedBody = Object.keys(req.body);
        requestedBody.forEach(key => loggedInUser[key] = req.body[key])
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfuly`,
            data: loggedInUser,
        })

    } catch (err) {
        res.status(400).send("Error " + err.message);
    }
})

router.patch("/profile/password", userAuth, async (req, res) => {
    try {
        // validating user is logged in so useAuth will check and sent the logged in user
        //  getting old and new password from the request body 
        const { oldPassword, newPassword } = req.body;

        const user = req.user

        const isOldPasswordValid = await user.validatePassword(oldPassword);
        if (!isOldPasswordValid) {
            throw new Error("Old password is incorrect");
        }
        if (! validator.isStrongPassword(newPassword)) {
            throw new Error("New Password is not strong, It must include 1 number, 1 special character, 1 uppercase letter and 1 lowecase letter");
        }
        const isSamePassword = await user.validatePassword(newPassword);
        if (isSamePassword) {
            throw new Error("New password must be different from the old password.");
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.send("Password saved successfully.")

    } catch (err) {
        res.status(400).send("Error " + err.message)   
    }
})

module.exports = router;