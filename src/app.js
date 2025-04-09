const express = require('express');
const connectDB = require('./config/database')
const User = require('./models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isStrongPassword } = require('validator');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth')

const app = express();  //instance of class express

app.use(express.json());
app.use(cookieParser());

// create user 
app.post('/signup', async (req, res) => {
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
app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Erron("Invalid credentials");
        }
        const isPasswordValid = await validatePassword(password);
        if (isPasswordValid) {
            // creating a jwt token
            const token = await  user.getJWT();
            console.log(token)
            // setting jwt token in cookies 
            res.cookie("token", token)
            
            res.send("LoggedIn Successfully");
        }
        else {
            throw new Erron("Invalid credentials");
        }    
    }
    catch (err) {
        res.status(400).send("Error " + err.message); 
    }
})

app.get("/profile", userAuth ,async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

// get /user - user by email 
app.get("/user", async (req, res) => {
    const userEmailId = req.body.emailId;
    try {
        const user = await User.find({ emailId: userEmailId })
        if (!user) {
            res.send(404).send("User not found");
        }
        else {
            console.log(user);
            res.send(user);
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users);
        res.send(users);
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})

//Delete a user from the database 
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const userDeleted = await User.findByIdAndDelete({_id: userId });
        res.send("User deleted successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// update data of the user 
app.patch("/user", async (req, res) => {
    const data = req.body;
    const userEmail = req.body.emailId;
    // console.log(userEmail);
    try {
        const userUpdate = await User.findOneAndUpdate({ emailId: userEmail }, data, {
            runValidators:true,  //it is used if you have added validation on schema so the validations also start to apply on updated fields else it is not checking the validation if user is already added on database
        } )
        res.send('user updated successfully')
    }
    catch (err) {
        res.status(400).send("Can not update user due to" + err.message);
    }
})

//best way to connect and start server is first to connect with database then start running server
connectDB()
    .then(() => {
    console.log("successfully connected to databse devTinder")
    app.listen(7777, () => {
        console.log("Server is listening to Port 7777")
    })
}).catch((err) => {
    console.log(err);
})