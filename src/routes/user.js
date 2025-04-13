// User Router
// GET /user/requests/received
// - GET /user/connections
// - GET /user/feed - Gets you the profiles of other users on platform

const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const router = express.Router();

// all  pending connection request loggedin user have 
router.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;  
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser,
            status:"interested",
        }).populate("fromUserId", "firstName lastName skills age gender photoURL about")

        res.json({
            message: "Data fetched successfully",
            data : connectionRequests,
        })
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = router;