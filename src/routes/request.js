// Connection request router
// POST - /request/send/interested/:userid
// POST - /request/send/ignored/:userid
// POST - /request/review/accepted/:userid
// POST - /request/reiew/rejected/:userid

const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

const router = express.Router();

router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id; 
        const status = req.params.status;
        const toUserId = req.params.toUserId;

        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            return res.status(404).json({ message: "Invalid status type" + status }); 
        }

        const IsExistToUserId = await User.findById(toUserId);
        if (!IsExistToUserId) {
            return res.status(404).json({message:"User not found"})
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (existingConnectionRequest) {
            return res.status(404).json({
                message:"Connection Request already exists"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save();
        res.json({
            message: status === "interested" ? `${req.user.firstName} is interseted in ${IsExistToUserId.firstName} ` : 
                `${req.user.firstName} ignored ${IsExistToUserId.firstName} `
        })

    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

router.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        // loggedInUser is a fromUserId person 
        const loggedInUser = req.user;
        // toUserId person should be logged in as if 'a' sent request to 'b' , so 'b' has to be logged in to accept request of 'a' . and status must be interested then only b can either accept or reject the a's request.
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(404).json({
                message: "Status is not valid",
            })
        }

        const existRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status:"interested",
        });
         
        if (!existRequest) {
            return res.status(404).json({
                message: "User not found",
            })
        }

        existRequest.status = status;

        const data = await existRequest.save();

        res.json({
            message: "Connection request is " + status,
            data,
        })

    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = router;