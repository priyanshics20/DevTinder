const express = require('express');
const connectDB = require('./config/database')
const app = express();  //instance of class express
const User = require('./models/user')

app.use(express.json());

// create user 
app.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        res.send("User added Successfully");
    }
    catch (err) {
        res.status(400).send("error saving the user" + err.message);
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
    console.log(userEmail);
    try {
        const userUpdate = await User.findOneAndUpdate({ emailId: userEmail }, data)
        res.send('user updated successfully')
    }
    catch (err) {
        res.status(400).send("Something went wrong");
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