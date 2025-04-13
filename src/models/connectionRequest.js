const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //refrence to user collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["accepted", "rejected", "ignored", "interested"],
            message: "{VALUE} is incorrect status type",
        }
    },
},
    {
        timestamps: true
    }
);

// compound indexing
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// before saving it into db this check will be called and validate it 
// const data = await connectionRequest.save();  //before saving into db 
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // check if the fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
})

const ConnectionRequest = mongoose.model('ConncetionRequest', connectionRequestSchema);
module.exports = ConnectionRequest;