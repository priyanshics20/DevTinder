// Authetication routes like login , signup , logout
const express = require("express");
const bcrypt = require("bcrypt");
const User = require('../models/user')
const { isStrongPassword } = require('validator');


const router = express.Router();

// create user 
router.post('/signup', async (req, res) => {
    try {
        const { firstName, emailId, password, ...optionalFields } = req.body;

        // validating password 
        if (!isStrongPassword(password)) {
            throw new Error ("Password is not strong enough.")
        }

        // Encypt the password 
        const passwordHash = await  bcrypt.hash(password, 10)

        // const user = new User(req.body)
        const user = new User({firstName:firstName, emailId:emailId , password: passwordHash , ...optionalFields });
        await user.save();
        res.send("User added Successfully");
    }
    catch (err) {
        res.status(400).send("error saving the user" + err.message);
    }
})


// login user 
router.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            // creating a jwt token
            const token = await  user.getJWT();
            // console.log(token)
            // setting jwt token in cookies 
            res.cookie("token", token)
            
            res.send("LoggedIn Successfully");
        }
        else {
            throw new Error("Invalid credentials");
        }    
    }
    catch (err) {
        res.status(400).send("Error " + err.message); 
    }
})

// logout user 
router.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    }).send("Logged out successfully")
})

module.exports = router;