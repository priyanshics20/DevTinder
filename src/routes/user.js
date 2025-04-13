// User Router
// GET /user/requests/received
// - GET /user/connections
// - GET /user/feed - Gets you the profiles of other users on platform

const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const router = express.Router();

const USER_SAFE_DATA = "firstName lastName skills age gender photoURL about"

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

router.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted", },
                { fromUserId: loggedInUser._id, status: "accepted", },
            ],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId" , USER_SAFE_DATA);

        // we have to check if loggedIn user is let's say "AB" and have connection with "CD" then 
        // "AB" UI must show toUserId data which is "CD" so that's why we have to populate both fromUserId and toUserId
        const data = connections.map(row => {
            // have to first convert it into string as objectId can not be compared without string format in mongoose
            if (loggedInUser._id.toString() === row.fromUserId.id.toString()) {
                return row.toUserId;
            }
            else
                return row.fromUserId;
        });

        res.json({
            data,
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = router;